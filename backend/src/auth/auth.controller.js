
import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";


export async function signup(req,res){
    const {username,role,email,password} = req.body;
try{
    if(!username || !role || !email || !password){
        return res.status(400).json({message : "All fields are required"})

    }

    if(role.toLowerCase()!="user" && role.toLowerCase()!="admin"){
        return res.status(400).json({message : "role is not defined"})


    }
    
     if(password.length <6){
        return res.status(400).json({message : "The password is too short please try again"})

     }

     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
     }

     const existingEmail =await UserModel.findOne({email});

     if(existingEmail){
        return res.status(400).json({message : "email already exists - login"})

     }

     const saltedPassword = await bcrypt.hash(password,10);

     const newUser = await UserModel.create({
        username,
        email,
        role,
        password : saltedPassword
     })

     const token = jwt.sign({userid : newUser._id },process.env.JWT_SECRET_KEY,{expiresIn : "7d"})

     res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevent XSS attacks,
            sameSite: "strict", // prevent CSRF attacks
            secure: process.env.NODE_ENV === "production",
          });


    res.status(201).json({ success: true, user: newUser });
}
catch(err){
    console.log("Error occured while trying to signup",err);
    return res.status(400).json({message : "Internal server error"})
}

}


export async function login(req,res){
    const {email,password} = req.body;

    try{

        if(!email || !password){
            return res.status(400).json({message : "All the fields are required"})

        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user =await UserModel.findOne({email});

        if(!user){
            return res.status(400).json({message : "Authentication failed : invalid credentials"})

        }

        const passwordMatched = await bcrypt.compare(password,user.password);

        if(!passwordMatched){
            return res.status(400).json({message : "Authentication failed : invalid credentials"})
        }

        const token = jwt.sign({userid : user._id},process.env.JWT_SECRET_KEY,{expiresIn : "7d"});

        res.cookie("jwt",token,{
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevent XSS attacks,
            sameSite: "strict", // prevent CSRF attacks
            secure: process.env.NODE_ENV === "production",
        })
        console.log("user logged in");
        return res.status(200).json({success : true, user})
        



    }
    catch(err){
        console.log("Error occured while logging in",err);
        return res.status(401).json({message : `Error occured while logging in ${err}`});

    }
}