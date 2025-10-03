import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    username : {
        type : String,
        required : true,
    },
    Products : {
        type : Array,
        default : []
    }
    ,role : { 
        type : String,
        default : "user"
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        unique : true,
        minlength : 6
    }

    
})


const UserModel = mongoose.model("user",UserSchema);

export default UserModel;