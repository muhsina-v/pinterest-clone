import Pin from "../../models/pinSchema.js";
import User from "../../models/userSchema.js";

// Get a single pin by ID
export const getPinById = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id)
      .populate("comments.commented", "username avatar") // populate user info on comment
      .lean();

    if (!pin) {
      return res.status(404).json({ message: "Pin not found" });
    }

    res.status(200).json(pin);
  } catch (error) {
    console.error("Error fetching pin:", error);
    res.status(500).json({ message: "Server error while fetching pin" });
  }
};

// Post a comment on a pin
export const commentOnPin = async (req, res) => {
  const { text, commented } = req.body;
  const { id: pinId } = req.params;

  try {
    const pin = await Pin.findById(pinId);
    if (!pin) {
      return res.status(404).json({ message: "Pin not found" });
    }

    // Optional: Validate user exists before adding comment
    const user = await User.findById(commented);
    if (!user) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const newComment = {
      text,
      commented: user._id,
    };

    pin.comments.push(newComment);
    await pin.save();

    const updatedPin = await Pin.findById(pinId)
      .populate("comments.commented", "username avatar");

    res.status(200).json(updatedPin);
  } catch (error) {
    console.error("Error commenting on pin:", error);
    res.status(500).json({ message: "Server error while commenting" });
  }
};
