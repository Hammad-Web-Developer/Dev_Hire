import express from 'express'
import { connect } from 'mongoose'
import "dotenv/config"
import { recruitRouter } from './routes/recruitRouter.mjs'
import { recruit } from './models/recruitSchemas.mjs'
import { hrRouter } from './routes/hrRouter.mjs'
import { errorHandler } from './middlewares/errorHandler.mjs'

const app = express()
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use("/recruit",recruitRouter)
app.use("/company",hrRouter)
app.use(errorHandler)

const port = 6060

const start = async() =>{
    try{
        await connect(process.env.Mongo_URI)
        await recruit.createIndexes()
        app.listen(port,()=>{

            console.log(`Server is listening at port ${port}`)
        })
    } catch(err){
        console.log({msg:err})
    }
}

start()