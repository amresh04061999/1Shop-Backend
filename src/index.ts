// require('dotenv').config({path: './env'})

import connectDB from "./DB/db";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { app } from "./app";
dotenv.config({ path: "./.env" });
cloudinary.config({
  //   cloud_name: "dml7yd3ok",
  //   api_key:"491451976731255",
  //   api_secret:"ISu_CuQdQ33L3yIl-7ODFIpCfYY"
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server is running at port :${process.env.PORT}  `);
    });
  })
  .catch((error) => {
    console.log("Mongo db connection faild !!!", error);
  });
