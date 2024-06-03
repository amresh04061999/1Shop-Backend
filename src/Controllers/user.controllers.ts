import { asyncHandler } from "../utility/asyncHandler";
import User from "../Models/users.model";
import { ApiError } from "../utility/ApiError";
import { ApiResponse } from "../utility/ApiResponse";
import { uploadOnCloudinary } from "../utility/cloudinary";
import jwt from "jsonwebtoken"

// Define the return type for the function
interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const generateAccessAndRefreshTokens = async (userId: string): Promise<Tokens> => {
  try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(404, "User not found");
      }
      const accessToken = user.generateAccessToken();
      console.log(accessToken);
      const refreshToken = user.generateRefreshToken();
      console.log(refreshToken);

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
  } catch (error) {
      throw new ApiError(500, "Something went wrong while generating refresh and access token");
  }
};

const userRegistration = asyncHandler(async (req: any, res: any) => {
  // get user detials form frontend
  // validation not empty
  // check if userare already exists username or password
  // check for image profile
  // uplodad then cloudnary  and check ipload or not in cloudnary
  // create user object for entry in db
  // resposne password and refresh token field remove on response
  // check for user createtion
  // return response
  const { userName, email, password } = req.body;
  if ([userName, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { userName }],
  });

  if (existedUser) {
    if (existedUser.email === email) {
      return res.status(409).json(new ApiError(409, "Email already exists"));
    } else if (existedUser.userName === userName) {
      return res.status(409).json(new ApiError(409, "Username already exists"));
    }
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }
  const user = await User.create({
    userName,
    email,
    password,
    role: "user",
    avatar: avatar.url,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async(req: any, res: any) => {
  // console.log(req.body);
    const { email, password } = req.body;
    if (!email) {
      throw new ApiError(400, "Email required");
    }
    const user = await User.findOne({
      $or: [{ email }],
    });
    // console.log(user);
    
    if (!user) {
      throw new ApiError(400, "Usr does not exist");
    }
// console.log(password);

const isPasswordValid = await user.isPasswordCorrect(password)
if (!isPasswordValid) {
 throw new ApiError(401, "Invalid user credentials")
 }

  const  {accessToken,refreshToken}  =await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    // only server modife
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged In Successfully"
        )
      );
  });

  // logout user
  const logoutUser = asyncHandler(async(req:any, res:any) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})
const refreshAccessToken = asyncHandler(async (req:any, res:any) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
      throw new ApiError(401, "unauthorized request")
  }

  try {
      const decodedToken :any= jwt.verify(
          incomingRefreshToken,
          process.env.REFRESH_TOKEN_SECRET ?? ""
      )
  
      const user = await User.findById(decodedToken?._id)
  
      if (!user) {
          throw new ApiError(401, "Invalid refresh token")
      }
  
      if (incomingRefreshToken !== user?.refreshToken) {
          throw new ApiError(401, "Refresh token is expired or used")
          
      }
  
      const options = {
          httpOnly: true,
          secure: true
      }
  
      const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
  
      return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
          new ApiResponse(
              200, 
              {accessToken, refreshToken: refreshToken},
              "Access token refreshed"
          )
      )
  } catch (error) {
      throw new ApiError(401, "Invalid refresh token")
  }

})

export { userRegistration, loginUser ,logoutUser,refreshAccessToken};
