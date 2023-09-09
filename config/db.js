import mongoose from "mongoose";
const connectdb=async() =>{
    try{
const conn=await mongoose.connect(process.env.mongo_url);
console.log(`connected to db ${conn.Connection.host}`);
    }
    catch(error){
        console.log(`error in mongo db${error}`);
    }
}

export default connectdb;