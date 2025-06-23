import Pin from "../../models/pinSchema.js";


export const getPinsByCategories = async (req, res) => {
  const { categories } = req.body; // Expect array like ["food", "fashion"]
  console.log(req.body)
  try {
    const pins = await Pin.find({ category: { $in: categories } }).populate("userId");
    res.status(200).json(pins);
  } catch (error) {
    console.error("Error fetching pins by categories", error);
    res.status(500).json({ message: "Failed to fetch pins", error });
  }
};
