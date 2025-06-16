import Pin from "../../models/pinSchema.js";
import mongoose from "mongoose";

// Like a pin
export const likePost = async (req, res, next) => {
  const { postId } = req.body;
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "Invalid pin ID" });
  }

  try {
    const pin = await Pin.findById(postId);
    if (!pin) return res.status(404).json({ message: "Pin not found" });

    if (pin.likedBy.includes(userId)) {
      return res.status(400).json({ message: "Pin already liked" });
    }

    pin.likedBy.push(userId);
    await pin.save();
    res.status(200).json({ message: "Pin liked", pin });
  } catch (err) {
    next(err);
  }
};

// Unlike a pin
export const unlikePost = async (req, res, next) => {
  const { postId } = req.body;
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "Invalid pin ID" });
  }

  try {
    const pin = await Pin.findById(postId);
    if (!pin) return res.status(404).json({ message: "Pin not found" });

    if (!pin.likedBy.includes(userId)) {
      return res.status(400).json({ message: "Pin not liked yet" });
    }

    pin.likedBy.pull(userId);
    await pin.save();
    res.status(200).json({ message: "Pin unliked", pin });
  } catch (err) {
    next(err);
  }
};

// Get all liked pins
export const getLikedPosts = async (req, res, next) => {
  const userId = req.userId;

  try {
    const likedPins = await Pin.find({ likedBy: userId }).populate("postedBy", "name email");
    if (likedPins.length === 0) {
      return res.status(404).json({ message: "No liked pins found" });
    }
    res.status(200).json({ likedPins });
  } catch (err) {
    next(err);
  }
};