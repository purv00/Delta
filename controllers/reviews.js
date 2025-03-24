//MVC model for the reviews
const Review = require("../models/review");
const Listing = require('../models/listing');

// post
module.exports.createReview = async (req , res) => {
    
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // this listing.review is a schema of the listings visit models
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash('success' , "Review Added..!!");
    res.redirect(`/listings/${listing._id}`);
};

//delete
module.exports.destroyReview = async (req , res) => {
    let {id , reviewId} = req.params;

    await Listing.findByIdAndUpdate(id , {$pull : {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success' , "Review Deleted..!!");

    res.redirect(`/listings/${id}`);
}