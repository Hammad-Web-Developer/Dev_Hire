export const errorHandler = (err,req,res)=>{
    res.status(req.status).send(req.message)
}