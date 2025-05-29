import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import {
  createPin,
  getAllPins,
} from "../controllers/user/pinControllers.js";
import { verifyToken } from "../middlewares/varifyToken.js";
import upload from "../middlewares/Upload.js";

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Pin routes
router.post("/pin", verifyToken, upload.single('image'), createPin);
router.get("/pin", getAllPins);

export default router;
