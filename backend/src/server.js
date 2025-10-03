import express from "express";
import authRouter from "./auth/auth.routes.js";
import "dotenv/config"
import { connectDB } from "./lib/db.js";
import { protectRouter } from "./middleware/middleware.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json())
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("Hello the server is working!")
})

app.get("/test",protectRouter,(req,res)=>{

    if(req.user.role!="user"){
        return res.status(401).json({message : "admin cannot acccess this page"})
    }

})

app.use("/auth",authRouter)

const port = process.env.PORT;


connectDB().then(()=>{
    app.listen(port,()=>{
        console.log("listening on port ", port);
    })
})