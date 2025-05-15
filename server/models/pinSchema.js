import mongoose from "mongoose";

const pinSchema = new mongoose.Schema({
  title: String,
  image: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Pin", pinSchema);
