// Here we stored the routs of the listings
const Listing = require('../models/listing')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


// index
module.exports.index = async (req , res) => {
    const allListings = await Listing.find({});     
    res.render("listings/index.ejs" , {allListings} );
} ; 

// new
module.exports.renderNewForm = (req , res) => {
    res.render('listings/new.ejs');
};

// show
module.exports.showListing = async (req , res) => {
    let{id} = req.params;
    const listing = await Listing.findById(id).populate({path: 'reviews' , populate: {path : 'author'}}).populate('owner');
    // this is a flash schema for the id validation
    if(!listing){
        req.flash('error' , 'listing you requested for Does not EXIST..!!');
        res.redirect('/listings')
    }
    res.render("listings/show.ejs" , {listing});
};

//create
module.exports.createListing = async (req , res , next  ) =>{
    // let{title , discription , image ,price, location , country} = req.body;
    // here there aree a simpler wayt to write this in new.ejs
    // If the client will not have any data the error will rase 
    // this if statement will face this for error in sort the server wiil not stop

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()
     

        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url , filename};

        //we want to save the mapbox coordinates in our database
        newListing.geometry = response.body.features[0].geometry;

        let savedListing = await newListing.save();

        console.log(savedListing);

        req.flash('success' , "New listing created..!!");
        res.redirect('/listings');
};

// edit
module.exports.renderEditForm = async (req , res) => {
    let{id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash('error' , 'listing you requested for Does not EXIST..!!');
        res.redirect('/listings')
    }   
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");

    res.render("listings/edit.ejs" , {listing , originalImageUrl});
};

// update
module.exports.updateListing = async (req , res) => {
    let{id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;    
        let filename = req.file.filename;
        listing.image = {url , filename};
        await listing.save();
    }

    req.flash('success' , "listing Updated!!");
    res.redirect(`/listings/${id}`);
};

//delete
module.exports.destroyListing = async (req , res) => {
    let{id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success' , "listing Deleted..!!");
    res.redirect('/listings');
};