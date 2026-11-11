import express from 'express'
import { hrLogin, hrSignup, jobSpecificApplications, myPostedJobs, postJob, updateStatus } from '../controllers/hr.mjs'
import { authUser } from '../middlewares/authUser.mjs'
import { authorizeUser } from '../middlewares/authorize.mjs'

export const hrRouter = express.Router()

hrRouter.route("/signup").post(hrSignup)
hrRouter.route("/login").post(hrLogin)
hrRouter.route("/jobs/applications/:id").get(authUser,authorizeUser,jobSpecificApplications).put(authUser,authorizeUser,updateStatus)
hrRouter.route("/jobs").post(authUser,authorizeUser,postJob).get(authUser,authorizeUser,myPostedJobs)
