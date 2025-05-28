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

// ✅ Function to generate JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ========================
// ✅ REGISTER CONTROLLER
// ========================
export const registerUser = async (req, res, next) => {
  try {
    // 1. Validate user input with Joi
    const { value, error } = registerValidationSchema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const { username, email, password, followers, following } = value;

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(
        new CustomError("User already exists with this email", 409)
      );
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create a new user
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

// ========================
// ✅ LOGIN CONTROLLER
// ========================
export const loginUser = async (req, res, next) => {
  try {
    // 1. Validate user input with Joi
    const { value, error } = loginValidationSchema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const { email, password } = value;

    // 2. Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return next(new CustomError("User not found", 404));
    }

    // 3. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new CustomError("Incorrect email or password", 401));
    }

    // 4. Generate token
    const token = createToken(user._id);

    // 5. Prepare response user object
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

// ========================
// ✅ LOGOUT CONTROLLER
// ========================
export const logoutUser = (req, res) => {
  // You can implement token blacklisting if needed
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
