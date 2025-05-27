import Pin from "../../models/pinSchema.js";  // Use Pin for the model

export const createPin = async (req, res, next) => {
  try {
    const { title, description, image } = req.body;

    const newPin = new Pin({     // Use Pin here, not pinSchema
      title,
      description,
      image,
      user: req.user.id,
    });

    await newPin.save();
    res.status(201).json({ success: true, message: "Pin created", pin: newPin });
  } catch (err) {
    next(err);
  }
};

export const getAllPins = async (req, res, next) => {
  try {
    const pins = await Pin.find().populate("user", "username email");
    res.status(200).json(pins);
  } catch (err) {
    next(err);
  }
};
