import Saved from "../../models/savePinSchema.js";


export const savePin = async (req, res) => {
  const userId = req.user;
  const { pinId } = req.body;
  console.log("User:", userId, "Pin:", pinId);

  try {
    let saved = await Saved.findOne({ userId });

    if (!saved) {
      const newSaved = new Saved({
        userId,
        pins: [pinId],
      });
      await newSaved.save();
      const updatedSaved = await newSaved.populate({
        path: "pins",
        select: "title description image link",
      });
      return res.status(201).json({ message: "Pin saved", saved: updatedSaved.pins });
    }

    const isPinSaved = saved.pins.some((pin) => pin.equals(pinId));

    if (isPinSaved) {
      // Unsave 
      saved.pins = saved.pins.filter((pin) => !pin.equals(pinId));
      await saved.save();
      const updatedSaved = await saved.populate({
        path: "pins",
        select: "title description image link",
      });
      return res.status(200).json({ message: "Pin unsaved", saved: updatedSaved.pins });
    } else {
      //  Save 
      saved.pins.push(pinId);
      await saved.save();
      const updatedSaved = await saved.populate({
        path: "pins",
        select: "title description image link",
      });
      return res.status(201).json({ message: "Pin saved", saved: updatedSaved.pins });
    }
  } catch (error) {
    console.error("Save/Unsave pin error:", error);
    res.status(500).json({ message: "Failed to save/unsave pin", error });
  }
};


export const getSavedPins = async (req, res) => {
  const userId = req.params.id;

  try {
    const saved = await Saved.findOne({ userId }).populate({
      path: "pins",
      select: "title description image link",
    });
    console.log("Saved pins for user:", saved);
    if (!saved) {
      return res.status(200).json([]);
    }
    res.status(200).json(saved.pins || []);
  } catch (error) {
    console.error("Get saved pins error:", error);
    res.status(500).json({ message: "Error fetching saved pins", error });
  }
};


export const checkPinSaved = async (req, res) => {
  try {
    const userId = req.user;
    const { pinId } = req.params;

    // Find the saved document for the user
    const savedDoc = await Saved.findOne({ userId });

    if (!savedDoc) {
      console.log("no")
      return res.json({ isSaved: false });
    }

    // Check if the pin exists in the pins array
    const isSaved = savedDoc.pins.includes(pinId);

    res.json({ isSaved });
  } catch (error) {
    console.error("Error checking saved pin:", error);
    res.status(500).json({ 
      error: "Internal server error",
      message: "Failed to check if pin is saved"
    });
  }
};