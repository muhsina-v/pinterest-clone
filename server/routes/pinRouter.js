import express from "express";
import multer from "multer";
import Pin from "../models/Pin.js";

const router = express.Router();

// Image storage setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + file.originalname),
});
const upload = multer({ storage });

// Upload a pin
router.post("/upload", upload.single("image"), async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;
  const pin = new Pin({ title, image });
  await pin.save();
  res.status(201).json({ message: "Pin uploaded" });
});

// Get all pins
router.get("/", async (req, res) => {
  const pins = await Pin.find();
  res.json(pins);
});

export default router;
