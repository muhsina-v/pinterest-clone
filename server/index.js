import express from "express";
import ConnectDB from "./config/dbConnect";
const app = express();

app.get("/", (req, res) => {
  console.log("about");
});

ConnectDB;

app.listen(3000, () => {
  console.log("server running on http://localhost:3000");
});
