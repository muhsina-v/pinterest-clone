import express from "express";
import {
  followToggle,
  getFollowerList,
  getFollowingList,
  removeFollower,
  getFollowCount,
  getFollowStatus,
} from "../controllers/followController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/toggle", verifyToken, followToggle);
router.get("/followers/:id", getFollowerList);
router.get("/following/:id", getFollowingList);
router.delete("/remove/:id", verifyToken, removeFollower);
router.get("/count/:id", getFollowCount);
router.get("/status/:id", verifyToken, getFollowStatus);

export default router;