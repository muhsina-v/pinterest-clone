import express from "express";
import {
  toggleFollow,
  getFollowers,
  getFollowing,
  removeFollower,
  getFollowCount,
  getFollowStatus,
} from "../controllers/user/followController.js";
import { verifyToken } from "../middlewares/varifyToken.js";

const router = express.Router();

router.post("/toggle", toggleFollow)
.get("/followers/:id",getFollowers);
router.get("/following/:id", getFollowing);
router.delete("/remove/:id", verifyToken, removeFollower);
router.get("/count/:id", getFollowCount);
router.get("/status/:id", verifyToken, getFollowStatus);

export default router;