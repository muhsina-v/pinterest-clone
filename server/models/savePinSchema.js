import mongoose from "mongoose";

const savedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pins: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pin" }],
});

export default mongoose.model("Saved", savedSchema);