import mongoose from "mongoose";

const schema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        lowercase : true,
        trim : true
    },
    codeHash : {
        type : String,
        required : true,
        trim : true
    },
    purpose : {
        type : String,
        required : true,
        enum : ["user-sign-up","reset-password","company-sign-up"]
    },
    expiresAt : {
        type : Date,
        required : true
    },
    attempts : {
        type : Number,
        default : 0
    }
})

schema.index({expiresAt:1},{expireAfterSeconds:0})
schema.index({email:1,purpose:1},{unique:true})

export const otpSchema = mongoose.model('otps',schema)
