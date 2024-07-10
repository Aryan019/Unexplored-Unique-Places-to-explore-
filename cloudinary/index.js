const cloudinary =  require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

// Configuring the Cloudinary 
//Setting up the config
// Associating the account with cloudinary instance 
cloudinary.config({
    // Assigning the value through the env variable
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_KEY,
    api_secret : process.env.CLOUDINARY_SECRET
});


// Instantiating an instance of cloudinary storage 
// and applying some constraints 

//storage object have our all info about that instance
const storage = new CloudinaryStorage({
    // pAssing in the object which we instantiated above 
    cloudinary,

    params:{
    folder : 'MinorProjectAryan',
    allowed : ['jpeg','png','jpg']
    }
})

// Exporting it 
// exporting cloudinary instance thats conifgured
// and storage which is the new  instance we just maked here 
module.exports = {
    cloudinary,
    storage
}