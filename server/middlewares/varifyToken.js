// middleware/verifyToken.js
import jwt from "jsonwebtoken";
import CustomError from "../utils/customError.js";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];

      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          throw new CustomError("Token is not valid", 401);
        }

        req.user = user; // attaching user data to request
        next();
      });
    } else {
      next(new CustomError("You are not authenticated", 401));
    }
  } catch (err) {
    next(err);
  }
};