import { asyncWrapper } from "../middlewares/asyncWrapper.mjs";
import { recruit } from "../models/recruitSchemas.mjs";
import codes from "http-status-codes"
import error from 'http-errors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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
    const token = jwt.sign({username:user.username,email:email},process.env.JWT_KEY,{expiresIn:"1d"})
    res.status(codes.OK).send({_id:user.id,username:user.username,email:user.email,jwt:token})
})