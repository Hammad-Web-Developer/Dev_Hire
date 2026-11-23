import { asyncWrapper } from '../middlewares/asyncWrapper.mjs'
import { recruit } from "../models/recruitSchemas.mjs"
import { hr } from "../models/hrSchame.mjs"
import codes from 'http-status-codes'
import { sendOtp } from '../middlewares/sendAndVerifyOtp.mjs'
import bcrypt from 'bcryptjs'
import error from 'http-errors'

const isEmailRegistered = async(req)=>{
    const {email,company = false} = req.body
    const status = company ? await hr.findOne({companyEmail : email}) : 
    await recruit.findOne({email : email})
        return !!status
}

export const sendResetPasswordOtp = asyncWrapper(async(req,res)=>{
    const {email,purpose} = req.body
    if (!await isEmailRegistered(req))
        throw new error(codes.NOT_FOUND,"Email is not registered!")
    const data = await sendOtp(email,purpose)
    if (!data)
        throw new error(codes.BAD_REQUEST,"Failed to send email!")
    res.status(codes.OK).send("Otp sent. You have 60 seconds to complete action!")
})

export const resetPassword = asyncWrapper(async(req,res)=>{
    const {email,company,password,confirmPassword} = req.body
    if (password !== confirmPassword)
        throw new error(codes.BAD_REQUEST,"Both password feilds should have same password!")
    const hashedPassword = await bcrypt.hash(password,10)
        const data = company ? await hr.findOneAndUpdate({companyEmail : email},{password:hashedPassword},
            {returnDocument:'after',runValidators:true}) :
            await recruit.findOneAndUpdate({email : email},{password:hashedPassword},
            {returnDocument:'after',runValidators:true})
    if (!data)
        throw new error(codes.NOT_FOUND,"Failed to reset password!")
    res.status(codes.OK).send({"Password-Updated":data})
})