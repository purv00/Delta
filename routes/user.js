const express = require("express");
const router = express.Router();
const User = require('../models/user.js');
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

//Controller
const userController = require('../controllers/users');

//signup
router.route('/signup')
.get(userController.renderSignupForm)
.post(WrapAsync(userController.signup));


//login
router.route('/login')
.get(userController.renderLoginForm)
.post(saveRedirectUrl , passport.authenticate("local" , {failureRedirect : '/login' , failureFlash : true}) , userController.login)


// logout
router.get('/logout', userController.logout);

module.exports = router;