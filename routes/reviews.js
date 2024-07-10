const express = require('express');
const route = express.Router({mergeParams:true});

const{validateReview,isLoggedIn,isReviewAuthor} = require('../middleware')

const Review = require('../models/review.js')
const Campground = require('../models/campground');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const reviews = require('../controllers/reviews')





route.post('/',isLoggedIn, validateReview,catchAsync(reviews.createReview))

// Here we are deleting a review not the entire campground
// we are just deleting a review or reviews on a particular campground  
// Protecting the delete route
route.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))

module.exports = route;