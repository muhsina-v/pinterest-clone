import React, { useEffect, useState } from "react";
import Masonry from "@mui/lab/Masonry";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import axiosInstance from "../utils/axios";
import { FiShare2, FiBookmark } from "react-icons/fi";

interface Pin {
  _id: string;
  image: string;
  title: string;
  description?: string;
}

const ExplorePage: React.FC = () => {
  const [pins, setPins] = useState<Pin[]>([]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const res = await axiosInstance.get<Pin[]>("/api/user/pin");

        const userCategories: string[] = JSON.parse(
          localStorage.getItem("userCategories") || "[]"
        );

        let filteredPins = res.data;

        if (userCategories.length > 0) {
          filteredPins = res.data.filter((pin) =>
            userCategories.some((category: string) =>
              pin.title.toLowerCase().includes(category.toLowerCase()) ||
              pin.description?.toLowerCase().includes(category.toLowerCase())
            )
          );
        }

        const shuffled = shuffleArray<Pin>(filteredPins);
        setPins(shuffled);
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
        await navigator.share({ title: pin.title, url: shareUrl });
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
      const res = await axiosInstance.post("/api/user/save-pin", {
        pinId: pin._id,
      });
      alert("Pin saved!");
    } catch (error) {
      console.error("Error saving pin:", error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-4">
          <Masonry columns={3} spacing={2}>
            {pins.map((pin) => (
              <div key={pin._id} className="relative group overflow-hidden rounded-lg shadow-md">
                <img src={pin.image} alt={pin.title} className="w-full object-cover rounded-lg" />
                <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <FiShare2
                    className="text-white bg-black p-1 rounded-full cursor-pointer"
                    size={24}
                    onClick={() => handleShare(pin)}
                  />
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                  <FiBookmark
                    className="text-white bg-black p-1 rounded-full cursor-pointer"
                    size={24}
                    onClick={() => handleSave(pin)}
                  />
                </div>
                <p className="text-sm text-center mt-2 font-semibold">{pin.title}</p>
              </div>
            ))}
          </Masonry>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
