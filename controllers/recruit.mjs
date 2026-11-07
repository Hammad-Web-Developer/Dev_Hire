import { asyncWrapper } from "../middlewares/asyncWrapper.mjs";
import { recruit } from "../models/recruitSchemas.mjs";
import { job } from "../models/jobSchema.mjs"
import codes from "http-status-codes"
import error from 'http-errors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { uploadToCloudinary } from "../middlewares/cloudinary.mjs";
import { apply } from "../models/applySchema.mjs";

export const recruitSignup = asyncWrapper( async(req,res) => {
    const {username,email,passcode,password} = req.body;
    let hashedPassword = await bcrypt.hash(password,10)
    const newRecruit = await recruit.create({
        "username":username,
        "email":email,
        "passcode":passcode,
        "password":hashedPassword
    });
    res.status(codes.CREATED).json({userCreated:newRecruit})
})

export const recruitLogin = asyncWrapper( async(req,res)=>{
    const {email,password} = req.body
    if(!email || !password)
        throw new error(codes.BAD_REQUEST,"Email and password are required!")
    const user = await recruit.findOne({email:email})
    if (!user)
        throw new error(codes.NOT_FOUND,"Email doesn't exist!")
    const auth = await bcrypt.compare(password , user.password)
    if (!auth)
        throw new error(codes.UNAUTHORIZED,"Invalid credentials!")
    const token = jwt.sign({_id:user._id,username:user.username,email:email,role:"employee"},process.env.JWT_KEY,{expiresIn:"1d"})
    res.status(codes.OK).send({_id:user._id,username:user.username,email:user.email,jwt:token})
})

export const getAllJobs = asyncWrapper( async(req,res)=>{
    const {category,type,mode,location} = req.query
    const filter = {}
    if (category)
        filter.description = {$regex:category,$options:"i"}
    if (type)
        filter.jobType = {$regex:type,$options:"i"}
    if (mode)
        filter.jobMode = {$regex:mode,$options:"i"}
    if (location)
        filter.location = location
    const filteredData = await job.find(filter)
    res.status(codes.OK).send({jobs:filteredData})
})

export const getOneJob = asyncWrapper( async(req,res)=>{
    const jobId = req.params.id
    const jobRequested = await job.findOne({_id:jobId})
    if (!jobRequested)
        throw new error(codes.NOT_FOUND,"Invalid job id parameter!")
    res.status(codes.OK).send(jobRequested)
})

export const applyForJob = asyncWrapper( async(req,res)=>{
    const result = await uploadToCloudinary(req.file.buffer)
    if (!result)
        throw new error(codes.BAD_REQUEST,"Resume not uploaded!")
    const jobVerification = await job.findOne({_id:req.body.jobId})
    if (!jobVerification)
        throw new error(codes.BAD_REQUEST,"Invalid Job Id!")
    const duplicate = await apply.find({jobId:req.body.jobId,applicantId:req.id})
    if (duplicate?.length !== 0)
        throw new error(codes.BAD_REQUEST,"Duplicate application request!")
    const application = await apply.create({
        jobId : req.body.jobId,
        applicantId: req.id,
        name: req.body.name,
        qualification: req.body.qualification,
        experience: req.body.experience,
        contact: req.body.contact,
        resume: {
            public_id: result.public_id,
            secure_url: result.secure_url,
            original_filename: result.original_filename
        }
    })
    res.status(codes.CREATED).send({applied : application})
})

export const appliedJobs = asyncWrapper( async(req,res)=>{
    const data = await apply.find({applicantId: req.id})
    if (data?.length === 0)
        return res.status(codes.OK).send("No jobs applied!")
    res.status(codes.OK).send(data)
})