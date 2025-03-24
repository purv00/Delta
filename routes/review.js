const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn ,isReviewAuthor} = require('../middleware.js');

//MYC controller
const reviewController = require("../controllers/reviews.js");


// Reviews
// post route
// here we used the one to many relatopn ship of the review of the listings
router.post('/' , isLoggedIn , validateReview , wrapAsync(reviewController.createReview));


//review Delete route

router.delete('/:reviewId', isLoggedIn , isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;