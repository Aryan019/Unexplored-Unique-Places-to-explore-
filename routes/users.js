const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users')



// Adding in the Schema
const User = require('../models/user')


router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))


router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo,passport.authenticate('local',{failureFlash : true,failureRedirect : '/login'}),users.login)


router.get('/logout',users.logout)
module.exports = router;

