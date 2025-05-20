import express from "express";
import userRoutes from "../server/routes/userRoutes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
const app = express();

dotenv.config();

const corsOption = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOption))
app.use(express.json());
app.use("/user", userRoutes);
app.get("/", (req, res) => {
  console.log("about");
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("conneted"))
  .catch((err) => console.log(err));

// app.use("/");

app.listen(3000, () => {
  console.log("server running on http://localhost:3000");
});
