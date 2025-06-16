import User from "../../models/userSchema.js";
import Follow from "../../models/followSchema.jss";
import CustomError from "../../utilities/customError.js";

export const toggleFollow = async (req, res, next) => {
  try {
    const { followingId } = req.body;
    const followerId = req.user.id;

    if (followerId === followingId) {
      return next(new CustomError("You cannot follow yourself", 400));
    }

    const existingFollow = await Follow.findOne({ follower: followerId, following: followingId });

    if (existingFollow) {
      await Follow.deleteOne({ follower: followerId, following: followingId });
      return res.status(200).json({ message: "Unfollowed successfully" });
    }

    const newFollow = new Follow({ follower: followerId, following: followingId });
    await newFollow.save();

    res.status(200).json({ message: "Followed successfully" });
  } catch (err) {
    next(err);
  }
};

export const removeFollower = async (req, res, next) => {
  try {
    const { id: followerId } = req.params;
    const followingId = req.user.id;

    await Follow.deleteOne({ follower: followerId, following: followingId });
    res.status(200).json({ message: "Follower removed successfully" });
  } catch (err) {
    next(err);
  }
};

export const getFollowers = async (req, res, next) => {
  try {
    const { id: userId } = req.params;

    const followers = await Follow.find({ following: userId })
      .populate("follower", "username profile fullname");

    res.status(200).json({ followers });
  } catch (err) {
    next(err);
  }
};

export const getFollowing = async (req, res, next) => {
  try {
    const { id: userId } = req.params;

    const following = await Follow.find({ follower: userId })
      .populate("following", "username profile fullname");

    res.status(200).json({ following });
  } catch (err) {
    next(err);
  }
};

// count
export const getFollowCount = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const followerCount = await Follow.countDocuments({ following: userId });
    const followingCount = await Follow.countDocuments({ follower: userId });

    res.status(200).json({ followerCount, followingCount });
  } catch (err) {
    next(err);
  }
};

export const getFollowStatus = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.id;

    const follow = await Follow.findOne({ follower: followerId, following: followingId });

    res.status(200).json({ isFollowing: !!follow });
  } catch (err) {
    next(err);
  }
};
