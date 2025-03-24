const User = require('../models/user.js');


// render
module.exports.renderSignupForm = (req ,res) => {
    res.render('../views/users/signup.ejs');
};

//signup
module.exports.signup = async (req , res) => {
    try{
        let {username , email , password} = req.body;
        const newUser = new User({email , username})
        const registeredUser = await User.register(newUser , password);
        console.log(registeredUser);
        req.login(registeredUser , (err) => {
            if(err){
                return next(err);
            }
            req.flash('success' , "Welcome to wanderlust..!!")
            res.redirect('/listings');
        })
        
    } catch (e){
        req.flash('error', e.message);
        res.redirect('/signup');
    }
};

//render login
module.exports.renderLoginForm = (req , res) => {
    res.render('users/login.ejs')
};

//login
module.exports.login = async (req , res) => {
    req.flash("success" , "Welcome to Wanderlust! you are loged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);  
};

//logout
module.exports.logout = (req ,res ,next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success" , "You are logged out!");
        res.redirect('/listings');
    })
};