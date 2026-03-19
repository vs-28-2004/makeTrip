const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync")
const { validateReview } = require('../middleware.js');
const { isLoggedIn , isReviewAuthor} = require('../middleware.js');
const reviewsController = require('../controllers/reviews.js');


// Review routes
router.post('/', isLoggedIn, validateReview, wrapAsync(reviewsController.createReview));

// delete review route
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviewsController.deleteReview));

module.exports = router;