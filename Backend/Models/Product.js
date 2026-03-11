const mongoose=require("mongoose");

const productSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: {
  type: String
},
    price:{
        type:Number,
        required:true,
        default:0,
    },
    category: { 
    type: String, 
    enum: ["Keychain", "Frame", "Jewelry","other"], // Add your categories here
    default: "other" 
  }
});


const Product= mongoose.model("Product",productSchema);
module.exports=Product;