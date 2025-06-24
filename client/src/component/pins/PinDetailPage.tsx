import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axios.ts";
import { FaDownload, FaShareAlt, FaComment, FaHeart } from "react-icons/fa";
import { User } from "lucide-react";

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
}

const PinDetailPage: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log(user);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [pin, setPin] = useState<Pin | null>(null);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const fetchPin = async () => {
    try {
      const res = await axiosInstance.get(`/api/user/pin/${id}`);
      const pinData = res.data;
      setPin(pinData);
      setLikesCount(pinData.likedBy?.length || 0);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setLiked(
        (user.id && pinData.likedby?.includes(user._id || user.id)) || false
      );
    } catch (err) {
      console.error("Failed to fetch pin:", err);
    }
  };
  console.log(pin);

  useEffect(() => {
    fetchPin();
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const getisSaved = async () => {
      try {
        const isSaved = await axiosInstance.get(`/api/user/isSaved/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("isfolowin", isSaved);

        setIsSaved(isSaved.data.isSaved);
      } catch (err) {
        console.error("Failed to check savded status:", err);
      }
    };
    getisSaved();
  }, []);

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log(user);
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
      const res = await axiosInstance.post(
        endpoint,
        { postId: pin?._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Sending like/unlike request:", {
      //   endpoint,
      //   postId: pin?._id,
      //   token,
      // });
      console.log(`${wasLiked ? "Unlike" : "Like"} response:`, res.data);
      fetchPin(); // Refresh pin data
    } catch (err: any) {
      console.error(`Failed to ${wasLiked ? "unlike" : "like"} pin:`, err);
      setLiked(wasLiked);
      setLikesCount(previousLikesCount);
      alert(err.response?.data?.message || "Failed to like/unlike pin.");
    }
  };
  //like and unlike a post
  // const handleLikeToggle = async (postId,userid) => {
  //   const isPostLiked = data?.likedby.some(item => item === userid);
  //   if (isPostLiked===false) {
  //     const response = await axiosInstance.post(`/like`, { postId });
  //     const savedData = response.data.post;
  //     handleAsync(fetchPin)();
  //   } else {
  //     const response = await axiosInstance.delete(`/unlike`, {
  //       data: { postId },
  //     });
  //     const Data = response.data.post;
  //     handleAsync(fetchPin)();
  //   }
  // };
  const handleDownload = async () => {
    if (!pin) return;

    try {
      const response = await fetch(pin.image, {
        mode: "cors",
      });
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
      alert(
        "Download failed. Try opening the image in a new tab and saving manually."
      );
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

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to save a pin.");
      return;
    }

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
      setIsSaved(!isSaved)
      console.log("Save response:", res.data);
    } catch (error) {
      console.error("Failed to save pin:", error);
      alert("Failed to save pin.");
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await axiosInstance.post(
        `/api/user/pin/${id}/comment`,
        { text: comment, commented: user?.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

  const generateAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random&color=fff&size=40`;
  };

  if (!pin)
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  console.log(pin);

  return (
    <div className="min-h-screen bg-white">
      {/* Pinterest-style layout */}
      <div className="max-w-6xl mx-auto px-4 py-29">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left side - Image */}
          <div className="relative group">
            <div className="relative overflow-hidden rounded-3xl shadow-xl bg-gray-50">
              <img
                src={pin.image}
                alt={pin.title}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Floating action buttons on image */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={handleShare}
                  className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <FaShareAlt className="text-gray-700" size={16} />
                </button>
                <button
                  onClick={handleDownload}
                  className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <FaDownload className="text-gray-700" size={16} />
                </button>
                <button
                  onClick={handleLike}
                  className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <FaHeart
                    className={liked ? "text-red-600" : "text-gray-700"}
                    size={16}
                  />
                </button>
              </div>
            </div>
            <h1 className="text-2xl">{pin.userId.username}</h1>
          </div>

          {/* Right side - Details */}
          <div className="lg:pl-8">
            {/* Header actions */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-3 items-center">
                <button
                  onClick={handleShare}
                  className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors lg:hidden"
                >
                  <FaShareAlt className="text-gray-600" size={18} />
                </button>
                <button
                  onClick={handleDownload}
                  className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors lg:hidden"
                >
                  <FaDownload className="text-gray-600" size={18} />
                </button>
                <button
                  onClick={handleLike}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors lg:hidden ${
                    liked
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <FaHeart size={18} />
                </button>
                <span className="text-gray-700 text-sm">
                  {likesCount} Likes
                </span>
              </div>
              <button
                onClick={handleSave}
                className={` ${isSaved ? "bg-gray-500" : "bg-red-500"} text-white px-8 py-3 rounded-full font-semibold text-lg transition-colors shadow-lg hover:shadow-xl`}
              >
                {isSaved ? "Saved" : "Save"}
              </button>
            </div>

            {/* Pin title and description */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {pin.title}
              </h1>
              {pin.description && (
                <p className="text-gray-700 text-lg leading-relaxed">
                  {pin.description}
                </p>
              )}
            </div>

            {/* user infor */}
            {pin.postedBy && (
              <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  {pin.postedBy.avatar ? (
                    <img
                      src={pin.postedBy.avatar}
                      alt={pin.postedBy.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={generateAvatarUrl(pin.postedBy.name)}
                      alt={pin.postedBy.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {pin.postedBy.name}
                  </p>
                  <p className="text-gray-600 text-sm">Pin creator</p>
                </div>
              </div>
            )}

            {/* Comments section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaComment className="text-gray-600" size={14} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {pin.comments?.length || 0} Comments
                </h2>
              </div>

              {/* Comment input */}
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

              {/* Comments list */}
              {pin.comments && pin.comments.length > 0 && (
                <div className="space-y-4">
                  {pin.comments.map((c, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {c.commented?.avatar ? (
                          <img
                            src={c.commented.avatar}
                            alt={c.commented.username || "User"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={generateAvatarUrl(
                              c.commented?.username || "Anonymous User"
                            )}
                            alt={c.commented?.username || "User"}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="font-semibold text-gray-900 text-sm cursor-pointer"
                            onClick={() =>
                              navigate(`/user-profile/${c?.commented._id}`)
                            }
                          >
                            {c?.commented?.username || "Anonymous User"}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {new Date(c.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year:
                                new Date(c.createdAt).getFullYear() !==
                                new Date().getFullYear()
                                  ? "numeric"
                                  : undefined,
                            })}
                          </span>
                        </div>
                        <p className="text-gray-800 text-sm leading-relaxed">
                          {c.text}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={commentsEndRef} />
                </div>
              )}

              {pin.comments?.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaComment className="text-gray-400" size={24} />
                  </div>
                  <p className="text-gray-500 text-lg">No comments yet</p>
                  <p className="text-gray-400 text-sm">
                    Be the first to share what you think!
                  </p>
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
