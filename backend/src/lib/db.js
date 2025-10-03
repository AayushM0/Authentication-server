import mongoose from "mongoose"
import "dotenv/config"

const URI = process.env.MONGO_URI;

export const connectDB= async ()=>{
    try{
        const conn = await mongoose.connect(URI);
        console.log("MongoDB database connected");
    }
    catch(err){
        console.log("Error occured while connecting the mongoDB databse",err);
    }
}