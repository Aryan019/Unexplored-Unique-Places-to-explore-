const User = require('../models/user');

module.exports.renderRegister = (req,res)=>{

    res.render('users/register')
}

module.exports.register = async(req,res)=>{
    

    try{
    // Taking out form data and registering an user
    const{email,username,password} = req.body

    const user = new User({email, username})

    // Registering the user using the passport js 
    // takes in the new user instance 
    const registeredUser = await User.register(user,password);
    req.login(registeredUser,err =>{
        // If there is error hit the default error handler  
        if(err) return next(err);

        // If no error below lines are executed
        req.flash('success','Welcome to YelpCamp')
        res.redirect('/campgrounds');
    })
    
    } 

    catch(e){
        req.flash('error',e.message);
        res.redirect('register')
    }

    
}

module.exports.renderLogin = (req,res)=>{
    res.render('users/login')
    }

module.exports.login = (req,res)=>{
    req.flash('success','Welcome back!')
    const redirectUrl = res.locals.returnTo

    // Clearing the Session
    delete req.session.returnTo 
    res.redirect(redirectUrl || '/campgrounds') 
}

module.exports.logout = (req,res)=>{
   
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Succesfully Signed Out!! Visit Again :-)');
        res.redirect('/campgrounds');
    });

    
    
}