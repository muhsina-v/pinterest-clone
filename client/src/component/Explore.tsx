import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Masonry from "@mui/lab/Masonry";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import axiosInstance from "../utils/axios";
import { FiShare2, FiBookmark } from "react-icons/fi";

interface Pin {
  _id: string;
  image: string;
  title: string;
}

const ExplorePage: React.FC = () => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [token, setToken] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token") || "{}";
    setToken(token);
  }, []);

  useEffect(() => {
    const fetchPins = async (): Promise<void> => {
      try {
        const res = await axiosInstance.get("/api/user/pin");
        setPins(res.data);
      } catch (err) {
        console.error("Failed to fetch pins:", err);
      }
    };
    fetchPins();
  }, []);

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

  const handleSave = async (pin: Pin) => {
    try {
      const res = await axiosInstance.post(
        "/api/user/save-pin",
        { pinId: pin },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
      alert("ok");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative w-full bg-gray-100 min-h-screen">
      <div className="fixed top-0 left-0 z-20 lg:block hidden">
        <Sidebar />
      </div>

      <div className="fixed top-0 left-0 w-full z-30">
        <Navbar />
      </div>

      <main className="pt-16 sm:pt-20 lg:pl-26 lg:pt-20 px-2 sm:px-3 lg:px-4">
        

        <Masonry columns={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }} spacing={2}>
          {pins.map((pin: Pin) => (
            <div key={pin._id} className="mb-4 relative group">
              <Link to={`/pin/${pin._id}`} className="block">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition relative">
                  <img
                    src={pin.image}
                    alt={pin.title}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black-200 bg-opacity-40 opacity-0 group-hover:opacity-100 flex justify-end items-start p-2 gap-2 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleShare(pin);
                      }}
                      className="text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80"
                      title="Share"
                    >
                      <FiShare2 size={20} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleSave(pin);
                      }}
                      className="text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80"
                      title="Save"
                    >
                      <FiBookmark size={20} />
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Masonry>
      </main>
    </div>
  );
};

export default ExplorePage;
