const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("./schema.js")

module.exports.isLoggedIn = (req , res , next) => {
    if(!req.isAuthenticated()){
        // this originalurl is already stored in request object
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You must have to login First To create Listings!")
        return res.redirect('/login')
    }
    next();
};
//We have to save the redirect url in the locals to access the method
// this is for if the request is for the new litings the web will so the login page but after login we need too redirect in the new listing link
module.exports.saveRedirectUrl = (req , res ,next) => {
    if(req.session.redirectUrl){
        // we add into locals 
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req , res , next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash('error' , "You are not the owner of the listigs");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// function of the listingSchema as a middleware
module.exports.validateListing = (req , res , next) => {
    let {error} = listingSchema.validate(req.body);
        if(error){
            let erMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400 , erMsg);
        }else{
            next();
        }
}

// function of the reviewSchema as a middleware
module.exports.validateReview = (req , res , next) => {
    let {error} = reviewSchema.validate(req.body);
        if(error){
            let erMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400 , erMsg);
        }else{
            next();
        }
}

module.exports.isReviewAuthor = async (req , res , next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash('error' , "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};