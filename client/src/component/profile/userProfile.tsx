import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Masonry from "@mui/lab/Masonry";
import axiosInstance from "../../utils/axios";
import { FiArrowLeft, FiShare2, FiBookmark, FiHeart, FiGrid } from "react-icons/fi";

interface Pin {
  _id: string;
  image: string;
  title: string;
  description?: string;
  likedBy?: string[];
}

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  following?: string[];
  followers?: string[];
  createdAt: string;
}

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userPins, setUserPins] = useState<Pin[]>([]);
  const [savedPins, setSavedPins] = useState<Pin[]>([]);
  const [activeTab, setActiveTab] = useState<'created' | 'saved'>('created');
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false); // Add loading state for follow button
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token=localStorage.getItem("token") || "{}"

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUserPins();
      fetchSavedPins();
      checkFollowStatus(); // Add this to check follow status
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const res = await axiosInstance.get(`/api/user/profile/${userId}`);
      setUserProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };

  const checkFollowStatus = async () => {
    if (!currentUser || !currentUser._id || !userId) return;
    
    try {
      const isFollowingRes = await axiosInstance.get(
        `/api/follow/status/${userId}`,  {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("isfolowin",isFollowingRes);
      
      setIsFollowing(isFollowingRes.data.isFollowing);
    } catch (err) {
      console.error("Failed to check follow status:", err);
    }
  };

  const fetchUserPins = async () => {
    try {
      const res = await axiosInstance.get(`/api/user/pins/${userId}`);
      setUserPins(res.data);
    } catch (err) {
      console.error("Failed to fetch user pins:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedPins = async () => {
    try {
      const res = await axiosInstance.get(`/api/user/saved-pins/${userId}`);
      setSavedPins(res.data);
    } catch (err) {
      console.error("Failed to fetch saved pins:", err);
    }
  };

const handleFollow = async () => {
    console.log(currentUser)
  if (!currentUser?._id || !userId) return;
  setIsFollowLoading(true);

  try {
    const response = await axiosInstance.post(`/api/follow/toggle`, {
      followerId: currentUser._id,
      followingId: userId,
    });
    console.log("followw",response);
    
    const action = response.data.message;
    setIsFollowing(action === "Followed successfully");

    fetchUserProfile();
  } catch (err) {
    console.error("Error toggling follow:", err);
    alert("Failed to follow/unfollow user");
  } finally {
    setIsFollowLoading(false);
  }
};


  const handleShare = async (pin: Pin) => {
    const shareUrl = `${window.location.origin}/pin/${pin._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: pin.title,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Clipboard copy failed:", err);
      }
    }
  };
  console.log("fffffff",currentUser._id,userId)

  const handleSave = async (pin: Pin) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to save pins");
      return;
    }

    try {
      await axiosInstance.post(
        "/api/user/save-pin",
        { pinId: pin._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Pin saved successfully!");
    } catch (error) {
      console.error("Failed to save pin:", error);
      alert("Failed to save pin");
    }
  };

  const generateAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random&color=fff&size=200`;
  };

  const displayPins = activeTab === 'created' ? userPins : savedPins;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">User not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-red-600 hover:text-red-700 font-semibold"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <FiArrowLeft size={20} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              {userProfile.username}'s Profile
            </h1>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* User Info */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mx-auto mb-6">
            {userProfile.avatar ? (
              <img
                src={userProfile.avatar}
                alt={userProfile.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={generateAvatarUrl(userProfile.username)}
                alt={userProfile.username}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {userProfile.username}
          </h1>

          <p className="text-gray-600 mb-4">{userProfile.email}</p>

          {userProfile.bio && (
            <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-6 leading-relaxed">
              {userProfile.bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {userPins.length}
              </div>
              <div className="text-gray-600 text-sm">Pins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {userProfile.followers?.length || 0}
              </div>
              <div className="text-gray-600 text-sm">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {userProfile.following?.length || 0}
              </div>
              <div className="text-gray-600 text-sm">Following</div>
            </div>
          </div>
          
            
            
            <div className="flex justify-center gap-3 mb-4">
              <button
                onClick={handleFollow}
                disabled={isFollowLoading}
                className={`px-6 py-3 font-semibold rounded-full transition-colors duration-200 ${
                  isFollowing
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-900"
                    : "bg-red-600 hover:bg-red-700 text-white"
                } ${isFollowLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isFollowLoading
                  ? "Loading..."
                  : isFollowing
                  ? "Following"
                  : "Follow"}
              </button>
              
            </div>
          

          {/* <div className="text-gray-500 text-sm mt-4">
            Joined {new Date(userProfile.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div> */}
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-full p-1 flex">
            <button
              onClick={() => setActiveTab('created')}
              className={`px-6 py-2 rounded-full font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'created'
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FiGrid size={18} />
              Created ({userPins.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-6 py-2 rounded-full font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'saved'
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FiBookmark size={18} />
              Saved ({savedPins.length})
            </button>
          </div>
        </div>

        {/* Pins Grid */}
        {displayPins.length > 0 ? (
          <Masonry columns={{ xs: 2, sm: 3, md: 4, lg: 5 }} spacing={2}>
            {displayPins.map((pin: Pin) => (
              <div key={pin._id} className="mb-4 relative group">
                <div
                  onClick={() => navigate(`/pin/${pin._id}`)}
                  className="cursor-pointer"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition relative">
                    <img
                      src={pin.image}
                      alt={pin.title}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex justify-end items-start p-2 gap-2 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(pin);
                        }}
                        className="text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80"
                        title="Share"
                      >
                        <FiShare2 size={18} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSave(pin);
                        }}
                        className="text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80"
                        title="Save"
                      >
                        <FiBookmark size={18} />
                      </button>
                    </div>

                    {/* Pin info */}
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {pin.title}
                      </h3>
                      {pin.description && (
                        <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                          {pin.description}
                        </p>
                      )}
                      {pin.likedBy && pin.likedBy.length > 0 && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                          <FiHeart size={12} />
                          {pin.likedBy.length}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Masonry>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {activeTab === 'created' ? (
                <FiGrid className="text-gray-400" size={32} />
              ) : (
                <FiBookmark className="text-gray-400" size={32} />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No {activeTab} pins yet
            </h3>
            <p className="text-gray-600">
              {activeTab === 'created'
                ? `${userProfile.username} hasn't created any pins yet.`
                : `${userProfile.username} hasn't saved any pins yet.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;