import jwt from "jsonwebtoken";
import CustomError from "../utils/customError.js";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new CustomError("You are not authenticated", 401));
    }

    const token = authHeader.split(" ")[1];
    // console.log("Token:", token); // For debugging

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // console.error("Token verification error:", err);
        return next(new CustomError("Token is not valid", 401));
      }

      req.user = decoded.id; // Ensure `id` is the correct field in your JWT payload
      // console.log("User ID:", req.user); // For debugging
      next();
    });
  } catch (err) {
    // console.error("Middleware error:", err);
    next(err);
  }
};