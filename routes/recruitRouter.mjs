import express from 'express'
import { getAllJobs, recruitLogin, recruitSignup } from '../controllers/recruit.mjs'
import { authUser } from '../middlewares/authUser.mjs'

export const recruitRouter = express.Router()

recruitRouter.route("/signup").post(recruitSignup)
recruitRouter.route("/login").post(recruitLogin)
recruitRouter.route("/jobs").get(authUser,getAllJobs)