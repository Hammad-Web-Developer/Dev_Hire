import express from 'express'
import { recruitLogin, recruitSignup } from '../controllers/recruit.mjs'

export const recruitRouter = express.Router()

recruitRouter.route("/signup").post(recruitSignup)
recruitRouter.route("/login").post(recruitLogin)