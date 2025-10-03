import jwt from "jsonwebtoken"
import "dotenv/config"
import UserModel from "../models/userModel.js";


export const protectRouter = async (req,res,next)=> {
    

    try{
        const token = req.cookies.jwt;
        if(!token){
            console.log("token not found")
            return res.status(400).json({message : "User not logged in"})

        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);

        if(!decoded){
            console.log("broken at jwt")
            return res.status(400).json({message : "Unauthorized access"})

        }

        const user = await UserModel.findById(decoded.userid).select("-password")

        if(!user){
            
            console.log("broken at user")
            return res.status(401).json({message : "Unauthorized - User not found"})
        }

        req.user = user;
        next();

    }
    catch(err){
        console.log("Error occured while verifying the user",err)
        return res.status(400).json({message :"error occured while verifying the user"});
    }
}