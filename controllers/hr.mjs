import { asyncWrapper } from "../middlewares/asyncWrapper.mjs";
import { hr } from "../models/hrSchame.mjs";
import { job } from "../models/jobSchema.mjs"
import { apply } from "../models/applySchema.mjs"
import { sendOtp } from "../middlewares/sendAndVerifyOtp.mjs";
import codes from 'http-status-codes'
import error from 'http-errors'
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

export const sendOtpEmail = asyncWrapper(async(req,res)=>{
    const email = req.body.companyEmail
    const purpose = req.body.purpose
    if (purpose !== "company-sign-up" && purpose !== "reset-password")
        throw new error(codes.BAD_REQUEST,"Action not allowed!")
    await sendOtp(email,purpose)
    res.status(codes.OK).send("Otp sent. You have 60 seconds to complete sign-up!")
})

export const hrSignup = asyncWrapper(async(req,res) => {
    const {username,companyEmail,password,company} = req.body
        let hashedPassword = await bcrypt.hash(password,10)
        const hrUser = await hr.create({
            "username":username,
            "companyEmail":companyEmail,
            "password":hashedPassword,
            "company":company
        });
        res.status(codes.CREATED).json({userCreated:hrUser})
})

export const hrLogin = asyncWrapper( async(req,res)=>{
    const {companyEmail,password} = req.body
    if(!companyEmail || !password)
        throw new error(codes.BAD_REQUEST,"Email and password are required!")
    const user = await hr.findOne({companyEmail:companyEmail})
    if (!user)
        throw new error(codes.NOT_FOUND,"Email doesn't exist!")
    const auth = await bcrypt.compare(password , user.password)
    if (!auth)
        throw new error(codes.UNAUTHORIZED,"Invalid credentials!")
    const token = jwt.sign({_id:user._id,username:user.username,comapnyEmail:companyEmail,role:"company"},process.env.JWT_KEY,{expiresIn:"1d"})
    res.status(codes.OK).send({_id:user._id,username:user.username,companyEmail:user.companyEmail,jwt:token})
})

export const postJob = asyncWrapper( async(req,res)=>{
    const data = req.body
    data.companyId = req.id
    const newJob = await job.create(data)
    res.status(codes.CREATED).send({"jobCreated":newJob})
})

export const myPostedJobs = asyncWrapper( async(req,res)=>{
    const result = await job.find({companyId:req.id})
    if (result?.length === 0)
        return res.status(codes.OK).send("No jobs posted yet!")
    res.status(codes.OK).send(result)
})

export const jobSpecificApplications = asyncWrapper( async(req,res)=>{
    const jobId = req.params.id
    const verify = await job.findOne({companyId:req.id,_id:jobId})
    if (!verify)
        return res.status(codes.UNAUTHORIZED).send("Invalid job or company id!")
    const applications = await apply.find({jobId: jobId})
    if (applications?.length === 0)
        return res.status(codes.OK).send("No applications yet!")
    res.status(codes.OK).send(applications)
})

export const updateStatus = asyncWrapper( async(req,res)=>{
    const application = await apply.findOne({_id : req.params.id})
    if (!application)
        return res.status(codes.OK).send("Invalid application id!")
    const verify = await job.findOne({companyId:req.id,_id:application.jobId})
    if (!verify)
        return res.status(codes.UNAUTHORIZED).send("User unauthorized!")
    const updateJob = await apply.findByIdAndUpdate(
        req.params.id,
        {
            status : req.body.status
        },
        {
            returnDocument : 'after',
            runValidators : true
        }
    )
    res.status(codes.OK).send(updateJob)
})
