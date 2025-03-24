// User is a module in whuch we used the passport function for the authencation
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email : {
        type: String,
        required: true,
    },
});

// We use this plugin because mongoose will automatically give the username and password and hashing, salting
// so that we will only defined the email in the schema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User' , userSchema);

