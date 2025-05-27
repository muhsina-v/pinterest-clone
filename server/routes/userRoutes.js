import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { createPin, getAllPins } from "../controllers/user/pinControllers.js";
import { verifyToken } from "../middlewares/varifyToken.js";

const router = express.Router();

// User auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Pin routes inside same file
router.post('/pin', verifyToken, createPin);    // only logged in users can post
router.get('/pin', getAllPins);                 // anyone can view all pins

export default router;
