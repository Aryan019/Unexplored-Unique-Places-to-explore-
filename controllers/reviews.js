const Review = require('../models/review.js')
const Campground = require('../models/campground');


module.exports.createReview = async(req,res)=>{
    // Finding the campground whose review has been written

const campground = await Campground.findById(req.params.id);    

// We have imported the whole model 
const review = new Review(req.body.review);
review.author = req.user._id 

campground.reviews.push(review)
await review.save();
await campground.save();

req.flash('success','Created New Review Successfully!')

// Then redirecting 
res.redirect(`/campgrounds/${campground._id}`);
 
}

module.exports.deleteReview = async (req,res)=>{

    const{ id, reviewId} = req.params;
    
    // It tells to pull from the reviews array 
    // and pull where we have review id as the passed id 
    
    await Campground.findByIdAndUpdate(id, {$pull :{reviews :reviewId}})
    
    await Review.findByIdAndDelete(reviewId)
    
    req.flash('success','Successfully Deleted Review!')
    res.redirect(`/campgrounds/${id}`);
    
    }