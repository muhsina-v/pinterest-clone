import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// SECRET KEYS (You can also use env variables)
const ACCESS_SECRET = "access_secret_key";
const REFRESH_SECRET = "refresh_secret_key";

// In-memory refresh token store (for demo)
let refreshTokens = [];

// ✅ Register
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err });
  }
};

// ✅ Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    // Generate tokens
    const accessToken = jwt.sign({ id: user._id }, ACCESS_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET);

    refreshTokens.push(refreshToken); // store refresh token

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err });
  }
};

// ✅ Refresh Token
export const refreshToken = (req, res) => {
  const { token } = req.body;
  if (!token || !refreshTokens.includes(token)) {
    return res.status(403).json({ message: "Refresh token invalid" });
  }

  jwt.verify(token, REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = jwt.sign({ id: user.id }, ACCESS_SECRET, {
      expiresIn: "15m",
    });

    res.status(200).json({ accessToken: newAccessToken });
  });
};

// ✅ Logout
export const logoutUser = (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter((t) => t !== token);
  res.status(200).json({ message: "Logged out" });
};

// ✅ Get user
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers", "username")
      .populate("following", "username");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err });
  }
};

// ✅ Follow user
export const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentUserId } = req.body;

    if (userId === currentUserId) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const userToFollow = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow.followers.includes(currentUserId)) {
      userToFollow.followers.push(currentUserId);
      currentUser.following.push(userId);

      await userToFollow.save();
      await currentUser.save();

      res.status(200).json({ message: "Followed successfully" });
    } else {
      res.status(400).json({ message: "Already following" });
    }
  } catch (err) {
    res.status(500).json({ message: "Follow error", error: err });
  }
};

// ✅ Unfollow user
export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentUserId } = req.body;

    const userToUnfollow = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (userToUnfollow.followers.includes(currentUserId)) {
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (id) => id.toString() !== currentUserId
      );
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== userId
      );

      await userToUnfollow.save();
      await currentUser.save();

      res.status(200).json({ message: "Unfollowed successfully" });
    } else {
      res.status(400).json({ message: "Not following" });
    }
  } catch (err) {
    res.status(500).json({ message: "Unfollow error", error: err });
  }
};
