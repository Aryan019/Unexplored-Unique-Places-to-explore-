const Campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")

// Fetching the Mbx Geo Token 
const mapboxToken = process.env.MAPBOX_TOKEN;
//Instiating a new mapbox geo coding instance
const geocoder = mbxGeocoding({accessToken: mapboxToken})

const { cloudinary } = require("../cloudinary");

// Defining a function and exporting it named index
module.exports.index = async(req,res)=>{

    
    const campgrounds = await Campground.find({})

    // the folder name is inside the view directory in which 
    // a folder name campground that contains a file name an ejs 
    // file named index ejs
    res.render('campgrounds/index',{campgrounds})
    
}

module.exports.renderNewForm = (req,res)=>{
   

    res.render('campgrounds/new');
}


module.exports.createCampground = (async(req,res,next)=>{


    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    
      
//    dot map to iterate over the array 
    
    const campground = new Campground(req.body.campground)
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f=> ({url : f.path, filename : f.filename}))
    // Adding the author in 
    campground.author = req.user._id;
    await campground.save();

    console.log(campground)
    // Defining the flash msg here now go on and pass to the rendered route
    req.flash('success','Successfully Created a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
    
})

module.exports.showCampground = async(req,res)=>{

    // Campground is an model name 
    // or do 
    // const {id} = req.params ; 
    const campground = await Campground.findById(req.params.id).populate('reviews').populate({
        path : 'reviews',
        populate :{
            path : 'author'
        }
    }).populate('author')
    // If no campground found
    if(!campground){
        req.flash('error','Campground Not Found!!')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground})
}

module.exports.renderEditForm = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id)
   

    // If no camp then 
    if(!campground){
        req.flash('error','Campground Not Found!!')
        return res.redirect('/campgrounds');
    }

     res.render('campgrounds/edit',{campground})

} 

module.exports.updateCampground = async(req,res)=>{
    // Fetching the id from the request 
    const {id} = req.params;
    // The spreading logic on notes 
    // Finding the campground by id
   

    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    const imgs = req.files.map(f=> ({url : f.path, filename : f.filename}))
    campground.images.push(...imgs)
    await campground.save()
    // Removing the images from mongo and Cloudinary  
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull : {images: {filename :{$in: req.body.deleteImages}}}}) 
        console.log(campground)
    }
    req.flash('success','Successfully Updated Campground!')
    res.redirect(`/campgrounds/${campground._id}`)

}

module.exports.deleteCampground = async(req,res)=>{

    const {id} = req.params;
    // The spreading logic on notes 
    // Finding the campground by id
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        // If they are not the same
        // means the user who created campground and the user who is viewing is not same
        req.flash('error','Permission Not Available!')
        return res.redirect(`/campgrounds/${id}`)
    }

  
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully Deleted Campground!')
    res.redirect('/campgrounds');
}