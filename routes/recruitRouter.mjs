import express from 'express'
import { upload } from '../middlewares/multer.mjs'
import { appliedJobs, applyForJob, getAllJobs, getOneJob, recruitLogin, recruitSignup } from '../controllers/recruit.mjs'
import { authUser } from '../middlewares/authUser.mjs'

export const recruitRouter = express.Router()

recruitRouter.route("/signup").post(recruitSignup)
recruitRouter.route("/login").post(recruitLogin)
recruitRouter.route("/jobs/applied").get(authUser,appliedJobs)
recruitRouter.route("/jobs/:id").get(authUser,getOneJob)
recruitRouter.route("/jobs").get(authUser,getAllJobs).post(authUser,upload.single('resume'),applyForJob)