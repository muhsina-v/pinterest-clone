// routes/userRoutes.js
import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { createPin, getAllPins } from "../controllers/user/pinControllers.js";
import { verifyToken } from "../middlewares/varifyToken.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/pin", verifyToken, createPin); 
router.get("/pin", getAllPins);              

export default router;
