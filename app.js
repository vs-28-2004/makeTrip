if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync")
const ExpressError = require("./utils/ExpressError.js")
const listings = require('./routes/listing.js');
const review = require('./routes/review.js');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;  
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js'); 
const userRoutes = require('./routes/user.js');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.json());



const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 60 * 60 // time period in seconds
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sesstionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,  // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });


app.use(session(sesstionOptions));
app.use(flash());
 
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


async function main() {
  try {
    await mongoose.connect(process.env.ATLASDB_URL), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
    console.log('Connected to MongoDB');
  }
  catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}
main();


app.use((req, res, next) => {
  // they are local variables that are available in all templates rendered after this middleware is called
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
});


app.use("/listings", listings);
app.use("/listings/:id/reviews", review);
app.use("/", userRoutes);

// show route
app.get('/listings/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" }
    });

  res.render('listings/show', { listing });
}));


// page not found route
app.use((req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});


app.use(((err, req, res, next) => {
  let { statusCode = 500, message = 'Something went wrong' } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('include/error', { err });
}));


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});