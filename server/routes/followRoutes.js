import express from "express";
import {
  toggleFollow,
  removeFollower,
  getFollowers,
  getFollowing,
  getFollowCount,
  getFollowStatus,
} from "../../controllers/user/followController.js";
import { verifyToken } from "../../middlewares/verifyToken.js";

const router = express.Router();

router.post("/toggle", verifyToken, toggleFollow);
router.delete("/remove/:id", verifyToken, removeFollower);
router.get("/followers/:id", getFollowers);
router.get("/following/:id", getFollowing);
router.get("/count/:id", getFollowCount);
router.get("/status/:id", verifyToken, getFollowStatus);

export default router;
