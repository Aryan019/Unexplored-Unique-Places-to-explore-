const {campgroundSchema} = require('./schemas.js')
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground')
const {reviewSchema} = require('./schemas.js')
const Review = require('./models/review')

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        // If anyone is not aunthenticated then 
        // Storing the path where they are 
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must be Signed in')
        return res.redirect('/login')
    }

    next(); 
}


//Putting validate campground here 
module.exports.validateCampground = (req,res,next)=>{
    // Defining schema to validate using joi  
   // Its not mongoose schema its going to validate our data 
   //before we even attempt to save it on mongoose 


   // Taking out the campgroundSchema and putting it somewhere else 
   // file called schemas.js

  


   // Jo bhi object aaega usse error extract kr rhe h 
   // and aryan ji error k andar ek property hoti h named as details
   const {error} = campgroundSchema.validate(req.body)

   if(error){
           const msg = error.details.map(el =>el.message).join(',')
           throw new ExpressError(msg,400)
   }

   else{
       next();
       // makes to the post req if no error are there 
   }
   

   // to see the server side validation 
   // const result = campgroundSchema.validate(req.body)
   // console(result)

   // and details is an array so using the map method to  iterate over it 
   // which creates a new array named details which contains a property named message 
   // and the message contains the actual error message 
   // if(error){
   //     const msg = error.details.map(element => element.message).join(',')
   //     throw new ExpressError(msg,400)
   // }
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        // If they are not the same
        // means the user who created campground and the user who is viewing is not same
        req.flash('error','Permission Not Available!')
        return res.redirect(`/campgrounds/${id}`)
    }

    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        // If they are not the same
        // means the user who created campground and the user who is viewing is not same
        req.flash('error','Permission Not Available!')
        return res.redirect(`/campgrounds/${id}`)
    }

    next();
}



// Creating a new middleware that redirects the user 
// back where he logged in 

module.exports.storeReturnTo = (req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }

    next();
}

module.exports.validateReview = (req,res,next)=>{
    const{error} = reviewSchema.validate(req.body)

    if(error){
       const msg = error.details.map(el =>el.message).join(',')
       throw new ExpressError(msg,400)
}


else{
   next();
   // makes to the post req if no error are there 
}
}