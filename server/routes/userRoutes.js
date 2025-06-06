import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import {
  createPin,
  getAllPins,
} from "../controllers/user/pinControllers.js";
import { verifyToken } from "../middlewares/varifyToken.js";
import upload from "../middlewares/Upload.js";
import Pin from "../models/pinSchema.js";
import PinModel from "../models/pinSchema.js";
import { getSavedPins, savePin } from "../controllers/user/savePinController.js";

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Pin routes
router.post("/pin", verifyToken, upload.single('image'), createPin);
router.get("/pin", getAllPins);
// GET /api/user/pin/:id
router.get("/pin/:id", async (req, res) => {
  const pin = await Pin.findById(req.params.id);
  res.json(pin);
});

router.post("/pin/:id/comment", async (req, res) => {
  try {
    const pin = await PinModel.findById(req.params.id);
    if (!pin) return res.status(404).json({ message: "Pin not found" });

    const comment = { text: req.body.text };
    pin.comments.push(comment);
    await pin.save();

    res.status(200).json(pin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/save-pin", verifyToken, savePin);
router.get("/saved-pins/:id", getSavedPins);

export default router;
