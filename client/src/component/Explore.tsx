import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Masonry from '@mui/lab/Masonry';
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import axiosInstance from "../utils/axios";

interface Pin {
  _id: string;
  image: string;
  title: string;
}

const ExplorePage: React.FC = () => {
  const [pins, setPins] = useState<Pin[]>([]);

  useEffect(() => {
    const fetchPins = async (): Promise<void> => {
      try {
        const res = await axiosInstance.get("/api/user/pin");
        console.log(res.data);
        setPins(res.data);
      } catch (err) {
        console.error("Failed to fetch pins:", err);
      }
    };

    fetchPins();
  }, []);

  return (
    <div className="relative w-full bg-gray-100 min-h-screen">
      <div className="fixed top-0 left-0 z-20 lg:block hidden">
        <Sidebar />
      </div>

      <div className="fixed top-0 left-0 w-full z-30">
        <Navbar />
      </div>

      <main className="pt-16 sm:pt-20 lg:pl-26 lg:pt-20 px-2 sm:px-3 lg:px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-red-900 text-center mb-8">
          Explore Ideas
        </h1>

        <Masonry columns={6} spacing={2}>
          {pins.map((pin: Pin) => (
            <div
              key={pin._id}
              className="grid-item w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6 mb-4"
            >
              <Link to={`/pin/${pin._id}`} className="block">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <img
                    src={pin.image}
                    alt={pin.title}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  {/* <div className="p-4">
                    <h2 className="text-lg font-semibold text-red-900 truncate">
                      {pin.title}
                    </h2>
                  </div> */}
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
