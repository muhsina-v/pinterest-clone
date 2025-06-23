import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axios.ts";
import {
  FaDownload,
  FaShareAlt,
  FaComment,
  FaHeart,
  FaCheck,
} from "react-icons/fa";

interface Comment {
  text: string;
  createdAt: string;
  commented: {
    _id: string;
    username: string;
    avatar: string;
  };
}

interface Pin {
  _id: string;
  image: string;
  title: string;
  userId: {
    _id: string;
    username: string;
  };
  description?: string;
  postedBy?: {
    name: string;
    avatar?: string;
  };
  comments?: Comment[];
  likedby?: string[];
  savedBy?: string[];
}

const PinDetailPage: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [pin, setPin] = useState<Pin | null>(null);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const fetchPin = async () => {
    try {
      const res = await axiosInstance.get(`/api/user/pin/${id}`);
      const pinData = res.data;
      setPin(pinData);
      setLikesCount(pinData.likedby?.length || 0);

      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      setLiked(pinData.likedby?.includes(currentUser._id || currentUser.id));
      setIsSaved(pinData.savedBy?.includes(currentUser._id || currentUser.id));
    } catch (err) {
      console.error("Failed to fetch pin:", err);
    }
  };

  useEffect(() => {
    fetchPin();
  }, [id]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to save a pin.");
      return;
    }

    if (isSaving) return;
    setIsSaving(true);

    try {
      const res = await axiosInstance.post(
        "/api/user/save-pin",
        { pinId: pin?._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const message = res.data.message;
      if (message === "Pin saved") {
        setIsSaved(true);
      } else if (message === "Pin unsaved") {
        setIsSaved(false);
      }
    } catch (error: any) {
      console.error("Save/Unsave error:", error);
      alert(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      alert("You must be logged in to like a pin");
      return;
    }

    const wasLiked = liked;
    const previousLikesCount = likesCount;
    setLiked(!wasLiked);
    setLikesCount(wasLiked ? likesCount - 1 : likesCount + 1);

    try {
      const endpoint = wasLiked ? "/api/user/unlike" : "/api/user/like";
      await axiosInstance.post(
        endpoint,
        { postId: pin?._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPin();
    } catch (err: any) {
      console.error(`Failed to ${wasLiked ? "unlike" : "like"} pin:`, err);
      setLiked(wasLiked);
      setLikesCount(previousLikesCount);
      alert(err.response?.data?.message || "Failed to like/unlike pin.");
    }
  };

  const handleDownload = async () => {
    if (!pin) return;
    try {
      const response = await fetch(pin.image, { mode: "cors" });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "pin-image.jpg";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Try opening the image in a new tab and saving manually.");
    }
  };

  const handleShare = async () => {
    if (navigator.share && pin) {
      await navigator.share({
        title: pin.title,
        url: window.location.href,
      });
    } else {
      alert("Web Share not supported.");
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await axiosInstance.post(
        `/api/user/pin/${id}/comment`,
{ text: comment, commented: user?._id || user?.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment("");
      fetchPin();
      setTimeout(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const generateAvatarUrl = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=40`;

  if (!pin) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Image Section */}
          <div className="relative group">
            <div className="relative overflow-hidden rounded-3xl shadow-xl bg-gray-50">
              <img
                src={pin.image}
                alt={pin.title}
                onClick={() => window.open(pin.image, "_blank")}
                className="w-full h-auto object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={handleShare} className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50">
                  <FaShareAlt className="text-gray-700" size={16} />
                </button>
                <button onClick={handleDownload} className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50">
                  <FaDownload className="text-gray-700" size={16} />
                </button>
                <button onClick={handleLike} className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50">
                  <FaHeart className={liked ? "text-red-600" : "text-gray-700"} size={16} />
                </button>
              </div>
            </div>
            <h1 className="text-2xl mt-4">{pin.userId.username}</h1>
          </div>

          {/* Details Section */}
          <div className="lg:pl-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-3 items-center">
                <span className="text-gray-700 text-sm">{likesCount} Likes</span>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 ${
                  isSaved
                    ? "bg-gray-800 hover:bg-gray-900 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                } ${isSaving ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : isSaved ? (
                  <>
                    <FaCheck size={16} />
                    <span>Saved</span>
                  </>
                ) : (
                  <span>Save</span>
                )}
              </button>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{pin.title}</h1>
            {pin.description && <p className="text-gray-700 text-lg mb-6">{pin.description}</p>}

            {/* Comments */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <FaComment className="text-gray-600" size={14} />
                <h2 className="text-xl font-semibold text-gray-900">{pin.comments?.length || 0} Comments</h2>
              </div>

              {/* Add Comment */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What do you think?"
                  className="w-full bg-transparent border-none outline-none resize-none text-gray-900 placeholder-gray-500 text-lg"
                  rows={3}
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleCommentSubmit}
                    disabled={!comment.trim()}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-full font-semibold transition-colors"
                  >
                    Post
                  </button>
                </div>
              </div>

              {/* Comments List */}
              {pin.comments?.length ? (
                <div className="space-y-4">
                  {pin.comments.map((c, index) => (
                    <div key={index} className="flex gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        <img
                          src={c.commented.avatar || generateAvatarUrl(c.commented.username)}
                          alt={c.commented.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="font-semibold text-gray-900 text-sm cursor-pointer"
                            onClick={() => navigate(`/user-profile/${c.commented._id}`)}
                          >
                            {c.commented.username}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {new Date(c.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: new Date(c.createdAt).getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
                            })}
                          </span>
                        </div>
                        <p className="text-gray-800 text-sm leading-relaxed">{c.text}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={commentsEndRef} />
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaComment className="text-gray-400" size={24} />
                  </div>
                  <p className="text-gray-500 text-lg">No comments yet</p>
                  <p className="text-gray-400 text-sm">Be the first to share what you think!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinDetailPage;
