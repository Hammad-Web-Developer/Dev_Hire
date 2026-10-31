import express from 'express'
import { hrLogin, hrSignup } from '../controllers/hr.mjs'

export const hrRouter = express.Router()

hrRouter.route("/signup").post(hrSignup)
hrRouter.route("/login").post(hrLogin)
