const express= require ("express");
const cors = require("cors");
const app=express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const mongoose=require("mongoose");
app.use("/uploads", express.static("uploads"));

 const Mongo_Url="mongodb://127.0.0.1:27017/resinMArt";
 const Product = require("./Models/Product");
const productroute=require("./routes/product.js");
const orderRoutes = require("./routes/order");
const userRoutes = require("./routes/user");
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);





main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
 console.log(err);
})


 async function main(){
     await mongoose.connect(Mongo_Url);
}
 

app.get("/",(req,res)=>{
    res.send(" Hii ,I am root");
})

app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});
app.use("/products",productroute);
 