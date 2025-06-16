import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export const FollowButton = ({ targetUserId }: { targetUserId: string }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?.token) return;
      try {
        const res = await axios.get(`${API}/follow/status/${targetUserId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setIsFollowing(res.data.isFollowing);
      } catch (err) {
        console.error("Follow status error:", err);
      }
    };
    checkStatus();
  }, [targetUserId]);

  const handleToggleFollow = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.token) return;
    try {
      await axios.post(
        `${API}/follow/toggle`,
        { followingId: targetUserId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Toggle follow failed:", err);
    }
  };

  return (
    <button
      onClick={handleToggleFollow}
      className={`px-4 py-2 text-white rounded-full shadow-md transition-all duration-300 ${
        isFollowing ? "bg-gray-500" : "bg-red-500"
      }`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export const FollowCount = ({ userId }: { userId: string }) => {
  const [count, setCount] = useState({ followerCount: 0, followingCount: 0 });

  useEffect(() => {
    const fetchCount = async () => {
      const res = await axios.get(`${API}/follow/count/${userId}`);
      setCount(res.data);
    };
    fetchCount();
  }, [userId]);

  return (
    <div className="flex space-x-4 text-gray-700">
      <span>{count.followerCount} Followers</span>
      <span>{count.followingCount} Following</span>
    </div>
  );
};

export const FollowerList = ({ userId }: { userId: string }) => {
  const [followers, setFollowers] = useState<any[]>([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      const res = await axios.get(`${API}/follow/followers/${userId}`);
      setFollowers(res.data.followers);
    };
    fetchFollowers();
  }, [userId]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Followers</h3>
      {followers.length === 0 ? (
        <p className="text-gray-400">No followers yet</p>
      ) : (
        <ul className="space-y-2">
          {followers.map((follower) => (
            <li key={follower._id} className="flex items-center gap-2">
              <img
                src={follower.follower.profile || "/default.jpg"}
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
              <span>{follower.follower.username}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const FollowingList = ({ userId }: { userId: string }) => {
  const [following, setFollowing] = useState<any[]>([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      const res = await axios.get(`${API}/follow/following/${userId}`);
      setFollowing(res.data.following);
    };
    fetchFollowing();
  }, [userId]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Following</h3>
      {following.length === 0 ? (
        <p className="text-gray-400">Not following anyone</p>
      ) : (
        <ul className="space-y-2">
          {following.map((f) => (
            <li key={f._id} className="flex items-center gap-2">
              <img
                src={f.following.profile || "/default.jpg"}
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
              <span>{f.following.username}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
