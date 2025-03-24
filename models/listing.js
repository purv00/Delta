const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type :String,
        required : true,
    },
    description : String,
    // here the set was used when the blanck inge will pass by the user but we need to set the default value with help of default
    image: {
        url : String,
        filename: String,
    },
    price : Number,
    location : String,
    country : String,
    reviews: [
        {
            type : Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    // Owner of the listings
    owner : {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry:{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
})

// delete handeling after delete the listi the review will also being deleted
listingSchema.post('findOneAndDelete' , async (listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});


// create model using the above schema
const Listing = mongoose.model('Listing' , listingSchema);


module.exports = (Listing);