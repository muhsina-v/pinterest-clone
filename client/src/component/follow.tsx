import React, { useEffect, useState } from "react";
import axios from "../utils/axios";

//followbutton
interface FollowButtonProps {
  targetUserId: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ targetUserId }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await axios.get(`/follow/status/${targetUserId}`);
        setIsFollowing(res.data.isFollowing);
      } catch (err) {
        console.error(err);
      }
    };
    checkStatus();
  }, [targetUserId]);

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      await axios.post("/follow/toggle", { followingId: targetUserId });
      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      className={`px-4 py-2 rounded-lg font-semibold ${
        isFollowing ? "bg-gray-300 text-black" : "bg-red-500 text-white"
      }`}
    >
      {loading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

//followcount
interface FollowCountProps {
  userId: string;
}

export const FollowCount: React.FC<FollowCountProps> = ({ userId }) => {
  const [count, setCount] = useState({ followerCount: 0, followingCount: 0 });

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axios.get(`/follow/count/${userId}`);
        setCount(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCount();
  }, [userId]);

  return (
    <div className="flex gap-6 mt-2">
      <p><strong>{count.followerCount}</strong> Followers</p>
      <p><strong>{count.followingCount}</strong> Following</p>
    </div>
  );
};

//followerlist
interface FollowerListProps {
  userId: string;
}

interface Follower {
  follower: {
    _id: string;
    username: string;
  };
}

export const FollowerList: React.FC<FollowerListProps> = ({ userId }) => {
  const [followers, setFollowers] = useState<Follower[]>([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await axios.get(`/follow/followers/${userId}`);
        setFollowers(res.data.followers);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFollowers();
  }, [userId]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Followers</h2>
      {followers.length === 0 ? (
        <p>No followers yet</p>
      ) : (
        <ul>
          {followers.map((f) => (
            <li key={f.follower._id} className="py-1">
              {f.follower.username}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
