import mongoose from "mongoose"

const recruitSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
        unique:true,
        trim:true,
        minlength:1,
        maxlength:[20,"Name can't be of more than twenty characters"]
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        match:/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/
    },
    passcode:{
        type:String,
        required:true,
        minlength:[6,"Passcode should be of 6 digits!"],
        maxlength:[6,"Passcode should not be more than 6 digits!"]
    },
    password:{
        type:String,
        required:true,
        match:[/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,"Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character"]
    }
}
)

export const recruit = mongoose.model("recruit",recruitSchema)