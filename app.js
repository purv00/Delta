// ENV FILE
if(process.env.NODE_ENV != "prodution"){
    require('dotenv').config();
}


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require('path');
// for the styling we have new ejs-mate
const ejsMate = require('ejs-mate');
// for patch and delete metod
const methodOverride = require('method-override')  // to do we have to install the npm override function
// to use override
app.use(methodOverride("_method"));
// express error
const ExpressError = require("./utils/ExpressError.js");
// Session
const session = require('express-session')
const MongoStore = require('connect-mongo');
// listing route
const listingRouter = require('./routes/listings.js');
// listing route
const reviewRouter = require('./routes/review.js');
// user route
const userRouter = require('./routes/user.js')

//flash
const flash = require('connect-flash');
// passport
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

app.set('view engine' , 'ejs');
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname , "public")));   

// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

const dburl = process.env.ATLASDB_URL;



async function main(){
    await mongoose.connect(dburl);
}
// to call the main function
main().then(() => {
    console.log("connected to Db")
}).catch((err) => {
    console.log(err);
});


const store = MongoStore.create({
    mongoUrl: dburl,
    crypto :{
        secret :  process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error" , () =>{
    console.log("Error in MONGO SESSION STORE" , err);
});

const sessionOption = {
    store, 
    secret: process.env.SECRET, 
    resave : false, 
    saveUninitialized : true,
    cookie: {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxage : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
};


// app.get('/' , (req , res) => {
//     res.send("Hi! i am root");
// });



// call session
app.use(session(sessionOption));
// call falsh
app.use(flash());
// defined the passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// calling flash is one type of validation 
// this is a middlware call local
app.use((req , res , next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    //local for the ejs tamplates
    res.locals.currUser = req.user;
    next();
})

// //demo user 
// app.get('/demouser' , async (req , res) =>{ 
//     let fakeUser = new User({
//         email : "student123@gmail.com",
//         username : "Delta-Student",
//     });
//     // this is register mentod already defined in the npm passsport website
//     let registeredUser = await User.register(fakeUser , "helloworld");
//     res.send(registeredUser);
// })

 
// Listings route
app.use('/listings' , listingRouter)
// review route
app.use('/listings/:id/reviews' , reviewRouter)
// user route
app.use('/' , userRouter)

    

// page not found 
app.all("*" , (req , res , next) => {
    next(new ExpressError(404 , "Page not found..!!"))
});



//Error handler Middleware  
app.use((err, req , res, next) => {
    let {statusCode = 500 , message = "Something Went Wrong" } = err;
    res.status(statusCode).render('listings/error.ejs' , {message});
    // res.status(statusCode).send(message);
})

app.listen(8080 , () => {
    console.log("server connect successfull...")
});


