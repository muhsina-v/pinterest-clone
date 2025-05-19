import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userSchema.js";
import CustomError from "../utils/customError.js";
import { joiUserSchema } from "../models/joiValSchema.js";

// Helper: Create JWT Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register Controller
export const registerUser = async (req, res, next) => {
  try {
    const { value, error } = joiUserSchema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const { username, email, password } = value;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new CustomError("User already exists with this email", 409));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

// Login Controller
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

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
    };

    res.status(200).json({ success: true, message: "Login successful", token, currentUser });
  } catch (err) {
    next(err);
  }
};

// Logout (optional, since it's JWT-based)
export const logoutUser = (req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
