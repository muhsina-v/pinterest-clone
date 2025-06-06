import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>({});
  const [savedPins, setSavedPins] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const fetchSavedPins = async () => {
      if (!user?._id) return;
      try {
        const res = await axiosInstance.get(`/api/user/saved-pins/${user._id}`);
        setSavedPins(res.data);
      } catch (err) {
        console.error("Failed to fetch saved pins:", err);
      }
    };

    fetchSavedPins();
  }, [user?._id]);

  return (
    <div className="pt-24 px-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{user?.username}'s Profile</h1>

      <div className="flex items-center gap-4 mb-6">
        <img
          src={user?.profileImage || "https://via.placeholder.com/80"}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">{user?.username || "Guest"}</h2>

          {user?.bio && (
            <p className="text-gray-700 text-sm mt-1">{user.bio}</p>
          )}

          {user?.website && (
            <a
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm mt-1 block hover:underline"
            >
              {user.website}
            </a>
          )}

          <p className="text-gray-600 text-sm mt-1">0 following</p>

          <button
            onClick={() => navigate("/edit-profile")}
            className="text-sm text-blue-500 hover:underline mt-2"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div className="col-span-full mt-10">
        <h3 className="text-lg font-semibold mb-4">
          {user?.username}'s Saved Pins
        </h3>

        {savedPins.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p>You haven't saved any Pins... yet</p>
            <p className="text-sm mt-1">
              Save your favourite ideas so you can easily come back to them later
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedPins.map((pin: any) => (
              <div
                key={pin._id}
                className="cursor-pointer hover:shadow-lg rounded-2xl overflow-hidden bg-white transition"
                onClick={() => navigate(`/pin/${pin._id}`)}
              >
                <img
                  src={pin.image}
                  alt={pin.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-3">
                  <h4 className="text-sm font-semibold">{pin.title}</h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
