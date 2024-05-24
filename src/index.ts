// require('dotenv').config({path: './env'})

import connectDB from "./DB/db"

import dotenv from "dotenv"

dotenv.config({path:'./.env'})
connectDB()