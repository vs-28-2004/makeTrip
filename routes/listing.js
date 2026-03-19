const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync")
const { isLoggedIn } = require('../middleware.js');
const { isOwner } = require('../middleware.js');
const { validateListing } = require('../middleware.js');
const listingsController = require('../controllers/listings.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const uploadCloud = multer({ storage });

// using the same route for both GET and POST requests to the root of the listings resource
router.route('/')
    .get(wrapAsync(listingsController.index))
    .post(uploadCloud.single('listing[image]'), validateListing,  wrapAsync(listingsController.createListing));


// create new listing test route
router.get('/new', isLoggedIn, listingsController.renderNewForm);

// using the same route for GET, PUT, and DELETE requests to a specific listing identified by its ID
router.route('/:id')
    .get(wrapAsync(listingsController.showListing))
    .put(validateListing, isLoggedIn, isOwner, uploadCloud.single('listing[image]'), wrapAsync(listingsController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingsController.deleteListing));

    
// edit listing route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingsController.editListing));

module.exports = router;