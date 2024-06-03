import { Router } from "express";
import { userRegistration } from "../Controllers/user.controllers";

const router = Router();
 router.route("/").post(userRegistration)
// http://localhost:8000/api/v1/users
export default  router ; 
