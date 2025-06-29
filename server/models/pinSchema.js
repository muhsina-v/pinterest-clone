import mongoose from "mongoose";

const pinSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    image: String,
    category:  { type: String, required:true }, 

    postedBy: {
      name: String,
      avatar: String,
    },

    comments: [
      {
        text: String,
        commented: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    likedby: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Pin = mongoose.model("Pin", pinSchema);
export default Pin;
