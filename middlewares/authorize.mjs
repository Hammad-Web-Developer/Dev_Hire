import error from 'http-errors'
import codes from 'http-status-codes'

export const authorizeUser = async(req,res,next)=>{
    if (req.role !== "company")
        throw new error(codes.UNAUTHORIZED,"User not authorized!")
    next()
}