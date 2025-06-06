// controllers/user/savePinController.js

import User from '../../models/userSchema.js';

export const savePin = async (req, res) => {
  const userId = req.user.id; // from JWT
  const { pinId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user.savedPins.includes(pinId)) {
      user.savedPins.push(pinId);
      await user.save();
    }

    res.status(200).json({ message: "Pin saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save pin", error });
  }
};




export const getSavedPins = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).populate("savedPins");
    res.status(200).json(user.savedPins);
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved pins", error });
  }
};
