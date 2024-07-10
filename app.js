if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

console.log(process.env.SECRET)

const express = require('express')
const app = express()
const path = require('path')
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const session = require('express-session');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const {campgroundSchema, reviewSchema} = require('./schemas.js')
const Review = require('./models/review.js')

const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const helmet = require('helmet')

const mongoSanitize = require('express-mongo-sanitize')


// Requiring the routes 
const campgroundRoutes = require('./routes/campground.js');
const reviewRoutes = require('./routes/reviews.js')
const userRoutes = require('./routes/users.js') 




// Establishing connection with mongoose
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
.then(()=>{
    console.log("Connection open for mongoose")
})

.catch(err =>{
    console.log("Oh no mongo threw an error")
    console.log(err)

})

// middleware telling the engine to use the ejs as ejsMate
app.engine('ejs',ejsMate)

// Middlewares here please  
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))



// As req.body in form tag the response coming from the form is empty 
// so to see the response of the form we use the below middleware 
// Serving static files
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'));  
app.use(express.static(path.join(__dirname,'public')))

app.use(mongoSanitize())

// Configuring the session
const sessionConfig = {
    name : '',
    secret : '',
    resave : false,
    saveUninitialized : true,
    // store :

    // Configuring the cookie that we sent back
    cookie:{
        httpOnly : true,
        // secure : true,
        expires : Date.now() + 1000 * 60 * 60 * 24 *7,
        maxAge : 1000 * 60 * 60 * 24 *7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(helmet({contentSecurityPolicy:false}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
// Adding the Global variable(have access to all templates)
// My middleware to save and add it to the cookie local env
// Setting it for every single req 
app.use((req,res,next)=>{
    // Track whether the user is signed in or not
    // if no currentUser than undefined
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error');
    next();
})


// Prefixing the routes with 
// Making the route reference here 
app.use('/',userRoutes)
app.use("/campgrounds",campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)


// Moving the routes into the route folder 

app.get('/',(req,res)=>{
    res.render('home')
})



// Defining what should happen to things if route didnt exist 
app.all('*',(req,res,next)=>{

    // Setting the name and the status code of the error if it hits it 
    // By using the errorname and statuscode 
    next(new ExpressError('Page Not found',404))
})


app.use((err,req,res,next)=>{

    // Deconstructing the incoming error 
    // Along with that setting up the default statusCode and message  
    
    const {statusCode = 500} = err;
    if(!err.message){
        err.message = 'Oh No, Something Went Wrong!!'
    }

    res.status(statusCode).render('error',{err})

})

app.listen(3000,()=>{
    console.log("Serving on port 3000")
})
