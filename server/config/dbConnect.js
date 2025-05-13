import mongoose from "mongoose";
const ConnectDB = async () => {
  mongoose.connect.on("connected", () => {
    console.log("db connected");
  });
  try {
    await mongoose.connect(process.env.MONGO_URL);
  } catch (error) {
    console.log(error.message);
  }
};
export default ConnectDB;
