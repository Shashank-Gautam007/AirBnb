const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async(req,res) => {
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);

    listing.reviews.push(newReview);

    //  yaha jo "reviews" aaya hai wo listing.js file se aaya hai kyuki ye review ek array hai jisame ham comment rating ko push kar rhe hai
    //The "reviews" shown here come from the `listing.js` file because `reviews` is an array in which we are pushing the comments and ratings.
 


    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created !");
    res.redirect(`/listings/${listing._id}`);
};


module.exports.deleteReview = async(req,res) => async (req,res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted !");
    res.redirect(`/listings/${id}`)

}