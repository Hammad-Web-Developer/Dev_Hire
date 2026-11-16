import express from 'express'
import { upload } from '../middlewares/multer.mjs'
import { appliedJobs, applyForJob, getAllJobs, getOneJob, recruitLogin, recruitSignup, updateApplication, sendOtpEmail } from '../controllers/recruit.mjs'
import { authUser } from '../middlewares/authUser.mjs'
import { verifyOtp } from '../middlewares/sendAndVerifyOtp.mjs'

export const recruitRouter = express.Router()

recruitRouter.route("/verify-email").post(sendOtpEmail)
recruitRouter.route("/signup").post(verifyOtp,recruitSignup)
recruitRouter.route("/login").post(recruitLogin)
recruitRouter.route("/jobs/applied").get(authUser,appliedJobs)
recruitRouter.route("/jobs/applied/:id").put(authUser,upload.single('resume'),updateApplication)
recruitRouter.route("/jobs/:id").get(authUser,getOneJob)
recruitRouter.route("/jobs").get(authUser,getAllJobs).post(authUser,upload.single('resume'),applyForJob)