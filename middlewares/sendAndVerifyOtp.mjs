import crypto from "node:crypto"
import dotenv from 'dotenv'
import { sendEmail } from "./sendEmail.mjs"
import { otpSchema } from "../models/otpSchema.mjs"
import error from 'http-errors'
import codes from 'http-status-codes'
import { hr } from "../models/hrSchame.mjs"
import { recruit } from "../models/recruitSchemas.mjs"

dotenv.config()

export const checkDomain = async(req,res,next)=>{
        const domain = req.body.companyEmail?.split("@")[1].toLowerCase()
        const blockedDomains = [
        'gmail.com',
        'yahoo.com',
        'outlook.com',
        'hotmail.com',
        'icloud.com',
        'proton.me'
    ]
        if (blockedDomains.includes(domain)){
            throw new error(codes.BAD_REQUEST,"Please use your company email!")
        }
        next()
}

export const sendOtp = async(email,purpose)=>{
    const otp = crypto.randomInt(0,1000000).toString().padStart(6,'0')
    const hashedOtp = crypto.createHmac('sha256',process.env.OTP_SECRET).update(otp).digest('hex')
    await sendEmail(email,otp,purpose)
    const data = await otpSchema.create({
        email : email,
        codeHash : hashedOtp,
        purpose : purpose,
        expiresAt : new Date(Date.now()+1*1000*60)
    })
    return data
}

export const verifyOtp = async(req,res,next)=>{
    const {purpose,passcode} = req.body
    const email = req.body.email || req.body.companyEmail
    if (req.body.company && !["company-sign-up","reset-password"].includes(purpose))
        throw new error(codes.BAD_REQUEST,"Action not allowed!")
    if (!purpose || !passcode || !email)
        throw new error(codes.BAD_REQUEST,"Insufficient data!")
    const targetEmail = email.trim().toLowerCase()
    const hashedOtp = crypto.createHmac('sha256',process.env.OTP_SECRET).update(passcode).digest('hex')
    const data = await otpSchema.findOne({
        email : targetEmail,
        purpose : purpose
    })
    if (!data)
        throw new error(codes.NOT_FOUND,"Invalid otp or email!")
    if (data.expiresAt.getTime() < Date.now())
        throw new error(codes.BAD_REQUEST,"Otp expired!")
    if (data.attempts >= 3)
        throw new error(codes.TOO_MANY_REQUESTS,"Please request otp again!")
    if (hashedOtp !== data.codeHash){
        data.attempts++
        await data.save()
        throw new error(codes.BAD_REQUEST,"Invalid otp!")
    }
    if (req.body.company){
        const status = await hr.findOne({companyEmail : email})
        if (status)
            throw new error(codes.BAD_REQUEST,"Email already registered!")
    } else {
    const status = await recruit.findOne({email : email})
    if (status)
        throw new error(codes.BAD_REQUEST,"Email already registered!")
}
    await otpSchema.deleteOne({_id : data._id})
    next()
}