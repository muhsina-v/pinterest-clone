import mongoose from "mongoose";

const pinSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    userId: String,
    image: String,

    postedBy: {
      name: String,
      avatar: String,
    },

    comments: [
      {
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Pin = mongoose.model("Pin", pinSchema);
export default Pin;
