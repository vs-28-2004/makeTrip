const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');
const listingSchema = new mongoose.Schema({ 
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image : {
        url: String,
        filename: String 
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

// Mongoose middleware to delete associated reviews when a listing is deleted
listingSchema.post('findOneAndDelete', async function(listing) {
    if (listing) {
        await Review.deleteMany({
            _id: {
                $in: listing.reviews
            }
        });
    }
});

// create a model
const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;

//create instance of model
