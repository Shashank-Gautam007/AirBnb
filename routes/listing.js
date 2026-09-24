const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer  = require('multer');

const { storage } = require("../cloudConfig.js");
const upload = multer({  storage });




router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

    
////====>>>>>  NEW ROUTE <<<<====

router.get("/new", isLoggedIn, listingController.renderNewForm);




router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


///// ====>>>>    EDIT ROUTE <<<<<=====

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;




// if(! newListing.title){
//     throw new ExpressError(400, "title is missing");
// }

// if(! newListing.description){
//     throw new ExpressError(400, "Description is missing");
// }

// if(! newListing.location){
//     throw new ExpressError(400, "location is missing");
// }

// let {title, description, image, price, country, location} = req.body;

