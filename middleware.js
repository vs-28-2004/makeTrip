const Listing = require('./models/listing');
const { listingSchema } = require('./schema.js');
const ExpressError = require('./utils/ExpressError.js');
const Review = require('./models/review.js');


// middleware to check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl; // store the url they are requesting
    req.flash('error', 'You must be signed in to do that!');
    return res.redirect('/login');
  }
    next(); 
}

//  middleware to save the url they are requesting before login and make it available in the response locals
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo; // make it available in the response locals
} else {
    res.locals.returnTo = '/listings'; // default redirect url  
  }
  next(); 
}
 

// middleware to check if the user is the owner of the listing
module.exports.isOwner = async(req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing.owner.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to edit this  listing!');
    return res.redirect(`/listings/${id}`);
  }
  next();
}

// middleware to validate the listing data using Joi
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body, {convert: true});
  if (error) {
    let msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};


// middleware to validate review data
module.exports.validateReview = (req, res, next) => {
  const { error } = Review.validate(req.body);
  if (error) {
    let msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// middleware to check if the user is the author of the review
module.exports.isReviewAuthor = async(req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if(!review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to delete this review!');
    return res.redirect(`/listings/${id}`);
  }
  next();
};