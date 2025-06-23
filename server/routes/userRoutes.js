// routes/userRoutes.js
import express from "express";
import { loginUser, registerUser, updateUser } from "../controllers/authController.js";
import {
  createPin,
  getAllPins,
  getCategoryBasedPins,
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
import { getUserProfile } from "../controllers/user/useridController.js";
import Pin from "../models/pinSchema.js";
import { getPinsByCategories } from "../controllers/user/categoryController.js";

const router = express.Router();

// auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// pin routes
router.post("/pin", verifyToken, upload.single("image"), createPin);
router.get("/pin", getAllPins);

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

router.get("/profile/:userId", getUserProfile);

// GET /api/pins/category/:categoryName
router.get("/category/:categoryName", async (req, res) => {
  const pins = await Pin.find({ category: req.params.categoryName });
  res.json(pins);
});

// GET /api/user/pin/search?category=food
router.get("/search", async (req, res) => {
  try {
    console.log("query",req.query);
    
    const { category } = req.query;
    console.log(category);
    

    const pins = await Pin.find({
      category: { $regex: new RegExp(category, "i") },
    });

    res.status(200).json({ pins });
  } catch (error) {
    res.status(500).json({ message: "Server error while searching pins." });
  }
});
router.get("/pin/:id", getPinById); 

router.post("/category-based-pins", getPinsByCategories);
router.post("/pin/category-based-pins", getCategoryBasedPins);

export default router;
