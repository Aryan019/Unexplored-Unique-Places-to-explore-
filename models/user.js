// Creating the user model  
const mongoose = require('mongoose');
const passport = require('passport');
const Schema = mongoose.Schema; 
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    // We want a email username and a password 
    email : {
        type : String,
        required :true,
        unique : true
    }

    // not gonna specify username and password
    // using passport js instead 
})
// This is going to add on to our Schema
UserSchema.plugin(passportLocalMongoose);


// Exporting the model(by creating its model )
module.exports  = mongoose.model('User',UserSchema);
