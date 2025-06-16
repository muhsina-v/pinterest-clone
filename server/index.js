import express from "express";
import userRoutes from "../server/routes/userRoutes.js";
import followRoutes from '../server/routes/followRoutes.js'
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import {connectCloundinary} from "./config/cloudinary.js";
import manageError from "./middlewares/manageError.js";
const app = express();

dotenv.config();

connectCloundinary();

const corsOption = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders:['Content-Type','Authorization']
};
app.use(cors(corsOption));

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/follow",followRoutes)

app.use(manageError)

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("conneted"))
  .catch((err) => console.log(err));

app.listen(3000, () => {
  console.log("server running on http://localhost:3000");
});
