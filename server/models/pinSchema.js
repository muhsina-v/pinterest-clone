import mongoose from "mongoose";

const pinSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String, // This will be a URL or filename from file upload
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to the user who created the pin
      required: true,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

export default mongoose.model("Pin", pinSchema);
