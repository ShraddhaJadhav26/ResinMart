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
    }
});


const Product= mongoose.model("Product",productSchema);
module.exports=Product;