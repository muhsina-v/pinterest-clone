import mongoose from "mongoose";

const pinSchema = new mongoose.Schema({
  title: String,
  description: String,
  userId: String,
  image: String,
}, { timestamps: true });

const Pin = mongoose.model("Pin", pinSchema); 
export default Pin;
