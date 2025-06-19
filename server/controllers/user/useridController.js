import User from "../../models/userSchema.js"; 

export const getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("-password") 
      .populate("followers", "_id username avatar") 
      .populate("following", "_id username avatar"); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
