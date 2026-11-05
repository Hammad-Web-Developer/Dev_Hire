import jwt from "jsonwebtoken"
import error from 'http-errors'
import codes from 'http-status-codes'

export const authUser = async(req,res,next)=>{
    const token = req.headers['authenticate']
    if (!token)
        throw new error(codes.UNAUTHORIZED,"Session token required!")
    const jwtToken = token.match(/^Bearer\s+(.+)$/i)?.[1] || token;
    const status = jwt.verify(jwtToken,process.env.JWT_KEY)
    if (!status)
        throw new error(codes.UNAUTHORIZED,"Invalid sesssion token!")
    req.role = status.role
    next()
}