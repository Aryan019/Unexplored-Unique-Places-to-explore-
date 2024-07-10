const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Defining the review schema here 
const reviewSchema = new Schema({
    body : String ,
    rating : Number,
    // Associating the user with the reviewSchema
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    }
})


// Plotting the model and exporting it 
//Connecting the review with the campground
// One to many relationship 
// Jese aryan ek campground h to uske multiple reviews ho sakte h na  
// Yaha pe one (campground) h aur many(reviews)
// Storing the object ids in the campground Schema of the reviews


// No two way relationship involved 
module.exports = mongoose.model("Review",reviewSchema);
