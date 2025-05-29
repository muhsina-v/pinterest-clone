import Pin from "../../models/pinSchema.js";



// Create a new Pin
export const createPin = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user; // Use req.user directly (string ID from verifyToken)
    console.log(req.file)
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Image is required" });
    }

    console.log("Uploaded file:", req.file); // Log the entire req.file for debugging

    const newPin = new Pin({
      title,
      description,
      userId, // Assign userId directly
      image: req.file.path, // Cloudinary image URL
    });

    const savedPin = await newPin.save();
    res.status(201).json(savedPin);
  } catch (error) {
    console.error("Create pin error:", error); // Log detailed error
    res.status(500).json({ message: "Failed to create pin", error: error.message });
  }
};
// Get all pins
export const getAllPins = async (req, res) => {
  try {
    const pins = await Pin.find().sort({ createdAt: -1 });
    res.status(200).json(pins);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pins", error });
  }
};

// Get pin by ID
export const getPinById = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id);
    if (!pin) return res.status(404).json({ message: "Pin not found" });
    res.status(200).json(pin);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pin", error });
  }
};

// Get pins by user
export const getPinsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const pins = await Pin.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(pins);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user pins", error });
  }
};

// Delete a pin
export const deletePin = async (req, res) => {
  try {
    const { id } = req.params;
    const pin = await Pin.findByIdAndDelete(id);
    if (!pin) return res.status(404).json({ message: "Pin not found" });
    res.status(200).json({ message: "Pin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete pin", error });
  }
};

// Update a pin
export const updatePin = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const updatedData = { title, description };
    if (req.file && req.file.path) {
      updatedData.image = req.file.path;
    }

    const updatedPin = await Pin.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedPin) return res.status(404).json({ message: "Pin not found" });
    res.status(200).json(updatedPin);
  } catch (error) {
    res.status(500).json({ message: "Failed to update pin", error });
  }
};
