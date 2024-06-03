import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { log } from "console";

// Define the interface for a User Document
interface IUser extends Document {
  _id:any;
  userName: string;
  email: string;
  password: string;
  avatar: string;
  role?: string;
  refreshToken?: string;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

// Define the Mongoose schema for User
const userSchema = new mongoose.Schema<IUser>(
  {
    userName: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    avatar: {
      type: String,
      required: [true, "Avatar is required"],
    },
    role: {
      type: String,
    },
    refreshToken: {
      type: String,
    }
  },
  { timestamps: true }
);

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(); // Properly handle the error by passing it to next
  }
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;

};
// Method to generate an access token
userSchema.methods.generateAccessToken = function (): any {
   return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
    },
    process.env.ACCESS_TOKEN_SECRET ?? "",
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY ?? "1h",
    }
  );
};

// Method to generate a refresh token
userSchema.methods.generateRefreshToken = function (): any {
return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET ?? "",
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY ?? "7d",
    }
  );

  
};

// Define the User model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
