import { configDotenv } from "dotenv";
import mongoose from "mongoose";


configDotenv();
async function createDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to Database");
    }catch(err){
        console.log("Failed connecting to Database");
        console.log(err);

    }
}

export default createDB;