const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campground')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')
// Requiring multer for storing the files
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({ storage });     
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');




 
// Optimizing the routes
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground))


router.get('/new',isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground))
 


// To see the way of older route visit the version.txt under texts


router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))


 

module.exports = router;