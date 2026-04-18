import { mongoose } from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () =>{
    try{
        const connectDatabase = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        )

        console.log(
      `/n Mongoose Database Connected : ${connectDatabase.connection.host}`
        )
    }catch(e){
        console.log(e)
        process.exit(1)
    }
}

export {connectDB}