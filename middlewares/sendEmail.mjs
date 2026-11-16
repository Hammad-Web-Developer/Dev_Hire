import { Resend } from 'resend'
import dotenv from 'dotenv'
import codes from 'http-status-codes'
import error from 'http-errors'

dotenv.config()

const resend  = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async(email,otp,purpose)=>{
    const { data,err } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: `Dev Hire ${purpose} OTP`,
        html: `<p>Enter this six digit otp code to successfully ${purpose} : ${otp}`
    })
    if (err)
        throw new error(codes.BAD_REQUEST,"Couldn't send verification email!")
    return data
}
