import React, { useEffect, useState } from "react";
import Masonry from "@mui/lab/Masonry";
import axiosInstance from "../utils/axios";
import { Link } from "react-router-dom";

interface Pin {
  _id: string;
  title: string;
  image: string;
  description?: string;
  category: string;
  userId: {
    username: string;
  };
}

const ExplorePage: React.FC = () => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPins = async () => {
    setLoading(true);
    try {
      const userCategories = JSON.parse(localStorage.getItem("userCategories") || "[]");
      console.log("Sending categories:", userCategories);

      const response = await axiosInstance.post("/api/user/pin/category-based-pins", {
        categories: userCategories,
      });

      setPins(response.data);
    } catch (error) {
      console.error("Failed to load pins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPins();
  }, []);

  return (
    <div className="pt-20 md:pl-20 pb-20 md:pb-4">
      <div className="p-4">
     

        {loading ? (
          <div className="text-center text-gray-500">Loading pins...</div>
        ) : pins.length === 0 ? (
          <div className="text-center text-gray-600">
            No pins found for your selected interests.
          </div>
        ) : (
          <Masonry columns={{ xs: 1, sm: 2, md: 6 }} spacing={2}>
            {pins.map((pin) => (
              <Link to={`/pin-detail/${pin._id}`} key={pin._id} className="block">
                <div className="rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow">
                  <img
                    src={pin.image}
                    alt={pin.title}
                    className="w-full object-cover"
                  />
                  <div className="p-1">
                    <h2 className="text-lg font-semibold">{pin.title}</h2>
                    {/* <p className="text-sm text-gray-600">{pin.category}</p>
                    <p className="text-sm text-gray-500">By {pin.userId?.username}</p> */}
                  </div>
                </div>
              </Link>
            ))}
          </Masonry>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;