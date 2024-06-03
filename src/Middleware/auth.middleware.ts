import { asyncHandler } from "../utility/asyncHandler";
import User from "../Models/users.model";
import { ApiError } from "../utility/ApiError";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req:any, _:any, next:any) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken:any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)
    
        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, "Invalid access token")
    }
    
})