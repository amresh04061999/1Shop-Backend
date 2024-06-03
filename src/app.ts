import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

const app = express();
const corsOptions ={
  origin:"http://localhost:5173",
  credentials:true, 
  optionSuccessStatus:200
}
app.use(cors(corsOptions));
  // app.use(cors({
  //   origin:process.env.CORS_ORIGIN,
  //   credentials:true
  // }));
  app.use(express.json({limit:"16kb"}));
  app.use(express.urlencoded({extended:true,limit:"16kb"}));
  app.use(express.static("public"));
  app.use(cookieParser());


//  routes import
import  userRoute from "./Routes/user.routes"
import  admin from "./Routes/admin.routes"


// router declaration'
app.use("/api/v1/users",userRoute);
app.use("/api/v1/admin",admin);
// http://localhost:8000/api/v1/users/register

export {app}