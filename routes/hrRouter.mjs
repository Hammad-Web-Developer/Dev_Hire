import express from 'express'
import { hrLogin, hrSignup, jobSpecificApplications, myPostedJobs, postJob, updateStatus, sendOtpEmail } from '../controllers/hr.mjs'
import { authUser } from '../middlewares/authUser.mjs'
import { authorizeUser } from '../middlewares/authorize.mjs'
import { verifyOtp,checkDomain } from '../middlewares/sendAndVerifyOtp.mjs'

export const hrRouter = express.Router()

hrRouter.route("/verify-email").post(checkDomain,sendOtpEmail)
hrRouter.route("/signup").post(verifyOtp,hrSignup)
hrRouter.route("/login").post(hrLogin)
hrRouter.route("/jobs/applications/:id").get(authUser,authorizeUser,jobSpecificApplications).put(authUser,authorizeUser,updateStatus)
hrRouter.route("/jobs").post(authUser,authorizeUser,postJob).get(authUser,authorizeUser,myPostedJobs)
