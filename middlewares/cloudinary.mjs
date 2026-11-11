import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import { fileTypeFromBuffer } from 'file-type'
import codes from 'http-status-codes'
import { PDFDocument } from 'pdf-lib'
import error from "http-errors"

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true
})

export const uploadToCloudinary = async(buffer) => {
    const type = await fileTypeFromBuffer(buffer)
    if (type?.mime !== "application/pdf")
        throw new error(codes.BAD_REQUEST,"Invalid file signature!")
    try {
        await PDFDocument.load(buffer)
    } catch(err) {
        throw new error(codes.BAD_REQUEST,err)
    }
    return new Promise((resolve,reject)=>{
        const stream = cloudinary.uploader.upload_stream({
            folder: "Dev_Hire/resumes",
            resource_type: "raw",
            type: "authenticated"
        },(error,result)=>{
            if (error)
                return reject(error)
            resolve(result)
        })
        stream.end(buffer)
    })
}

export default cloudinary