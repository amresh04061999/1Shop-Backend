import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, userRegistration } from "../Controllers/user.controllers";
import { upload } from "../Middleware/multer.middleware";
import { verifyJWT } from "../Middleware/auth.middleware";
const router = Router();
 router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        }
    ]),
    userRegistration
)

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post( refreshAccessToken)
// http://localhost:8000/api/v1/users
export default  router ; 
