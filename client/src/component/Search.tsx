import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Masonry from "@mui/lab/Masonry";
import axiosInstance from "../utils/axios";
import { FiShare2, FiBookmark } from "react-icons/fi";

interface Pin {
  _id: string;
  title: string;
  image: string;
  description?: string;
  link?: string;
  category: string;
}

const Search: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  console.log(queryParams);
  
  const searchQuery = queryParams.get("q") || "";
  console.log("eeee", searchQuery);

  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/api/user/search?category=${searchQuery}`);
        setPins(res.data.pins || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setLoading(false);
      }
    };

    fetchPins();
  }, [searchQuery]);

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
    if (!token) {
      alert("You must be logged in to save pins");
      return;
    }

    try {
      const res = await axiosInstance.post(
        "/api/user/save-pin",
        { pinId: pin._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Saved pin:", res.data);
      alert("Pin saved!");
    } catch (error) {
      console.error("Error saving pin:", error);
      alert("Failed to save pin");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Results for: <span className="text-red-600">{searchQuery}</span>
      </h1>

      {pins.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No pins found</h3>
          <p className="text-gray-600">Try searching for something else or check your spelling.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <Masonry columns={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }} spacing={2}>
            {pins.map((pin) => (
              <div key={pin._id} className="mb-4 relative group">
                <Link to={`/pin/${pin._id}`} className="block">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition relative">
                    <img
                      src={pin.image}
                      alt={pin.title}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />

                    {/* Hover Buttons */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex justify-end items-start p-2 gap-2 transition-opacity">
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

                    {/* Pin Info */}
                    {/* <div className="p-3">
                      <h2 className="font-semibold text-gray-900 text-sm truncate">
                        {pin.title}
                      </h2>
                      {pin.description && (
                        <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                          {pin.description}
                        </p>
                      )}
                      <p className="text-gray-500 text-xs mt-1">{pin.category}</p>
                    </div> */}
                  </div>
                </Link>
              </div>
            ))}
          </Masonry>
        </div>
      )}
    </div>
  );
};

export default Search;