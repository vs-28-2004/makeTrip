const Joi = require('joi');

// we are using Joi for validation of the listing form data before saving it to the database. This is server side validation. We will also use client side validation using HTML5 form validation attributes.
// create a schema for validation this is server side validation for the listing form
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().uri().allow(''),
    price: Joi.number().required().min(1),
    location: Joi.string().required(),
    country: Joi.string().required(),

    lat: Joi.number().required(),
    lng: Joi.number().required()
  }).required()
});

module.exports.reviewSchema = Joi.object({ 
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required()
}); 