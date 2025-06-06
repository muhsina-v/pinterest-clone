import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axios.ts";
import { FaDownload, FaShareAlt, FaComment } from "react-icons/fa";

interface Comment {
  text: string;
  createdAt: string;
}

interface Pin {
  _id: string;
  image: string;
  title: string;
  description?: string;
  postedBy?: {
    name: string;
    avatar?: string;
  };
  comments?: Comment[];
}

const PinDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pin, setPin] = useState<Pin | null>(null);
  const [comment, setComment] = useState("");
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const fetchPin = async () => {
    try {
      const res = await axiosInstance.get(`/api/user/pin/${id}`);
      setPin(res.data);
    } catch (err) {
      console.error("Failed to fetch pin:", err);
    }
  };

  useEffect(() => {
    fetchPin();
  }, [id]);

  const handleDownload = () => {
    if (!pin) return;
    const link = document.createElement("a");
    link.href = pin.image;
    link.download = "pin-image.jpg";
    link.click();
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

  const handleSave = () => {
    alert("Pin saved! (Simulated)");
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await axiosInstance.post(
        `/api/user/pin/${id}/comment`,
        { text: comment },
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

  if (!pin) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="flex justify-center py-24 px-4 bg-white min-h-screen">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg border border-gray-200">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-4">
          <div className="flex gap-4">
            <button onClick={handleShare} className="text-gray-600 hover:text-black">
              <FaShareAlt size={20} />
            </button>
            <button onClick={handleDownload} className="text-gray-600 hover:text-black">
              <FaDownload size={20} />
            </button>
          </div>
          <button
            onClick={handleSave}
            className="bg-red-600 text-white px-4 py-1 rounded-full hover:bg-red-700"
          >
            Save
          </button>
        </div>

        {/* Image */}
        <div className="w-full flex justify-center px-4">
          <img
            src={pin.image}
            alt={pin.title}
            className="rounded-xl max-h-[70vh] object-contain"
          />
        </div>

        {/* Comment Section */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <FaComment className="text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Comments ({pin.comments?.length || 0})
            </h2>
          </div>

          {/* Comment Input */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <button
            className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleCommentSubmit}
          >
            Add Comment
          </button>

          {/* Comment List */}
          {pin.comments && pin.comments.length > 0 && (
            <ul className="mt-4 space-y-2">
              {pin.comments.map((c, index) => (
                <li key={index} className="bg-gray-100 p-2 rounded-md text-sm">
                  <div>{c.text}</div>
                  <div className="text-gray-500 text-xs mt-1">
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
              <div ref={commentsEndRef} />
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PinDetailPage;
