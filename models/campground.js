const mongoose = require('mongoose')
const  Review = require('./review')
const Schema = mongoose.Schema;



const ImageSchema = new Schema({
    url : String,
    filename : String 
})


// Defining the Virtuals
ImageSchema.virtual('thumbnail').get(function(){
    
    // this will refer to the particular image
    // We dont need to store this on our model or database
    //because its just derived from the information we already storing
    return this.url.replace('/upload','/upload/w_200')
})

const opts = {toJSON :{virtuals : true}};

const CampgroundSchema = new Schema({
    title : String,

    // images are there in Schema
    images : [ImageSchema], 
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    price : Number,
    description : String,
    location : String,

    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },

    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Review'
        }
    ]



    

},opts);

// Registering an virtual property 
CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    
    // this will refer to the particular image
    // We dont need to store this on our model or database
    //because its just derived from the information we already storing
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p>`
})


// Trigerring the middleware through the 
// 204 line in app.js simply trigerring this middleware 
// and it already triggers when findByIdAndDelete is called 

// Defining the mongoose middleware here 
// And its a query middleware 
CampgroundSchema.post('findOneAndDelete',async function(doc){
    // Checking 
    // console.log("Deleted!!!!")

    // Checking what was deleted 
    // console.log(doc)

    if(doc){
        await Review.deleteMany({
            _id : {
                $in : doc.reviews
            }
        })
    }
})



// Defining the schema 
// making the model 
// exporting the model 


// Exporting the schema at the end 
module.exports = mongoose.model('Campground',CampgroundSchema)

// this can be also done as 
// const modexport = mongoose.model('Campground',CampgroundSchema) 
// module.exports = modexport 