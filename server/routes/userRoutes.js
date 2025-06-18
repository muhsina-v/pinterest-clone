// routes/userRoutes.js
import express from "express";
import { loginUser, registerUser, updateUser } from "../controllers/authController.js";
import {
  createPin,
  getAllPins,
  getPinsByUser,
} from "../controllers/user/pinControllers.js";
import {
  getPinById
} from "../controllers/user/pinDetailController.js";
import {
  commentOnPin
} from "../controllers/user/pinDetailController.js";

import { verifyToken } from "../middlewares/varifyToken.js";
import upload from "../middlewares/Upload.js";
import {
  getSavedPins,
  savePin,
} from "../controllers/user/savePinController.js";
import { likePost, unlikePost } from "../controllers/user/likeController.js";
import { updatePin, deletePin } from "../controllers/user/pinControllers.js";

const router = express.Router();

// auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// pin routes
router.post("/pin", verifyToken, upload.single("image"), createPin);
router.get("/pin", getAllPins);
router.get("/pin/:id", getPinById); 
router.post("/pin/:id/comment", commentOnPin); 
// saveroutes
router.post("/save-pin", verifyToken, savePin);
router.get("/saved-pins/:id", getSavedPins);

router.get("/pins/:userId", getPinsByUser);
//like
router.post("/like", verifyToken, likePost);
router.post("/unlike", verifyToken, unlikePost);
//delete

router.put("/updatepin/:id", verifyToken, updatePin);
router.delete("/pins/:id", verifyToken, deletePin);
router.patch("/update/:id",upload.single("profileImage"),updateUser)



export default router;
