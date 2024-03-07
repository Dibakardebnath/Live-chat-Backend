const express=require("express");
const dotenv=require("dotenv");
const { default: mongoose } = require("mongoose");


const app=express();
dotenv.config();

const connectDb=async()=>{
    try {
        const connect=await mongoose.connect(process.env.MONGO_URI)
       console.log("Server is connected with database")
    } catch (error) {
        console.log("Error connecting to database: " + error);
    }
}
connectDb();



app.get("/",(req,res)=>{
    res.send("api is running")
})










const PORT=process.env.PORT || 5000;
app.listen(PORT,console.log("Server is running................"))