import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/userSchema.js";
import CustomError from "../utils/customError.js";
import {
  registerValidationSchema,
  loginValidationSchema,
} from "../models/userJoiSchema.js"

dotenv.config();

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const registerUser = async (req, res, next) => {
  try {
    const { value, error } = registerValidationSchema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const { username, email, password, followers, following } = value;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(
        new CustomError("User already exists with this email", 409)
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      followers: followers || [],
      following: following || [],
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { value, error } = loginValidationSchema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const { email, password } = value;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new CustomError("User not found", 404));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new CustomError("Incorrect email or password", 401));
    }

    const token = createToken(user._id);

    const currentUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      currentUser,
    });
  } catch (err) {
    next(err);
  }
};
export const logoutUser = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
