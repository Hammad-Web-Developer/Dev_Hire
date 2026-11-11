import mongoose from "mongoose"

const schema = new mongoose.Schema({
    jobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"jobs",
        required:true
    },
    applicantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"recruit",
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
    },
    resume:{
        public_id:{
            type:String,
            required:true
        },
        secure_url:{
            type:String,
            required:true
        },
        original_filename:{
            type:String,
            required:true
        }
    },
    status:{
        type: String,
        default: "applied"
    }
})

export const apply = mongoose.model("Applications",schema)