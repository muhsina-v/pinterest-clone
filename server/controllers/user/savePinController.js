import Saved from "../../models/savePinSchema.js";


export const savePin = async (req, res) => {
  const userId = req.user;
  const { pinId } = req.body;
  console.log(userId,pinId)

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
    if (!isPinSaved) {
      saved.pins.push(pinId);
      await saved.save();
      const updatedSaved = await saved.populate({
        path: "pins",
        select: "title description image link",
      });
      return res.status(201).json({ message: "Pin saved", saved: updatedSaved.pins });
    }

    return res.status(400).json({ message: "Pin already saved" });
  } catch (error) {
    console.error("Save pin error:", error);
    res.status(500).json({ message: "Failed to save pin", error });
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
      return res.status(200).json([]); // Return empty array if no saved pins
    }
    res.status(200).json(saved.pins || []);
  } catch (error) {
    console.error("Get saved pins error:", error);
    res.status(500).json({ message: "Error fetching saved pins", error });
  }
};