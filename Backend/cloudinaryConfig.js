const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Connect to your Cloudinary account
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup the "Storage" (The folder where photos go)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Resin_Art_Products', // It will create this folder for you!
    allowedFormats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;