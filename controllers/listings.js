const Listing = require('../models/listing');

module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render('listings/index', { listings });
}

// create route to get all listings
module.exports.renderNewForm = (req, res) => {
  res.render('listings/new');
};


// show route
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id).populate({path : "reviews", 
    populate: {path: "author"}}).populate("owner");

  if (!listing) {
    req.flash('error', 'Cannot find that listing!');
    return res.redirect('/listings');
  }

  res.render('listings/show', { listing });
};

// create listing route
module.exports.createListing = async (req, res) => {
  if (!req.file) {
    req.flash('error', 'Image is required!');
    return res.redirect('/listings/new');
  }
  let imageUrl = req.file.path;
  let filename = req.file.filename;
  // console.log(req.body.listing);
  const newListing = new Listing(req.body.listing);
  newListing.image = {url: imageUrl, filename};

  newListing.geometry = {
    type: "Point",
    coordinates: [parseFloat(req.body.listing.lng), parseFloat(req.body.listing.lat)]
  };

  newListing.owner = req.user._id;
  
  await newListing.save();
  req.flash('success', 'Successfully created a new listing!');
  res.redirect('/listings');
};

// edit listing route
module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'Cannot find that listing!');
    return res.redirect('/listings');
  }

  let originalImage = listing.image.url;
  originalImage = originalImage.replace("/upload", '/upload/h_200,w_350');
  res.render('listings/edit', { listing, originalImage });
};

// update listing route
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const { title, description, image, price, location, country } = req.body.listing;
  let listings = await Listing.findByIdAndUpdate(id, { title, description, image, price, location, country });
  
  if(req.file) {
    let imageUrl = req.file.path;
    let filename = req.file.filename;
    listings.image = {url: imageUrl, filename};
    await listings.save();
  }
  req.flash('success', 'Successfully updated the listing!');
  res.redirect(`/listings/${id}`);
};


// delete listing route
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash('success', 'Successfully deleted the listing!');
  res.redirect('/listings');
};