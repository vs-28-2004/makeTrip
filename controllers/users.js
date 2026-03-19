const User = require('../models/user.js');




// User registration route
module.exports.renderSignupForm = (req, res) => {
  res.render('users/signup');
};

// Handle user registration
module.exports.signup = async (req, res) => {   
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Wanderlust!');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

// User login routes
module.exports.renderLoginForm = (req, res) => {
  res.render('users/login');
};

// Handle user login
module.exports.login = async(req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect(res.locals.returnTo || '/listings');
};


//  User logout route
module.exports.logout = (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }

    req.flash("success", "Logged you out!");
    res.redirect("/listings");
  });
};