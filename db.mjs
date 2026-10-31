import database from "mongoose";

export const connect = async(url)=>{
    await database.connect(url);   
}