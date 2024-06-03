import mongoose from "mongoose";
import { DB_Name } from "../constants";

  const connectDB = async () =>{
    try {
         const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`) ;
         console.log(`Database connection successfull ${(connectionInstance.connection.host)}`);
         
    } catch (error) {
           console.log("DataBase connection fail",error);
           throw error
    }
  }
export default connectDB


