import jwt from "jsonwebtoken";
import CustomError from "../utils/customError.js";

export const verifyToken = (req, res, next) => {
  try {
    // console.log("first")
  
    const authHeader = req.headers.authorization;
console.log("authHeader",authHeader)
    if (!authHeader) {
      return next(new CustomError("You are not authenticated", 401));
    }

    const token = authHeader.split(" ")[1];


    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new CustomError("Token is not valid", 401));
      }

      req.user = decoded.id; 
      next();
    });
  } catch (err) {
    next(err);
  }
};