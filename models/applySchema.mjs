import mongoose from "mongoose"

const schema = new mongoose.Schema({
    jobId:{
        type:ObjectId,
        required:true
    },
    applicantId:{
        type:ObjectId,
        required:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    qualification:{
        type:String,
        required:true,
        trim:true
    },
    experience:{
        type:String,
        required:true,
        trim:true
    },
    contact:{
        type:String,
        required:true,
        trim:true
    }
})

// use multer for handling file uploads