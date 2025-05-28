import Pin from "../../models/pinSchema.js";
import { pinValidationSchema } from "../../models/pinJoiSchema.js";
import CustomError from "../../utils/customError.js";

// ✅ Create Pin
export const createPin = async (req, res, next) => {
  try {
    const { value, error } = pinValidationSchema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const { title, imageUrl, description } = value;

    const newPin = new Pin({
      title,
      imageUrl,
      description,
      user: req.user.id, // from verifyToken
    });

    await newPin.save();

    res.status(201).json({
      success: true,
      message: "Pin created successfully",
      pin: newPin,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Get All Pins
export const getAllPins = async (req, res, next) => {
  try {
    const pins = await Pin.find().populate("user", "username");
    res.status(200).json({
      success: true,
      pins,
    });
  } catch (err) {
    next(err);
  }
};
