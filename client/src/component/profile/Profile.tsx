import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
  }, []);

  return (
    <div className="pt-24 px-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Your profile</h1>

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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="col-span-full">
          <h3 className="text-lg font-semibold">Your saved ideas</h3>
          <div className="mt-4 text-center text-gray-500">
            <p>You haven't saved any Pins... yet</p>
            <p className="text-sm mt-1">
              Save your favourite ideas so you can easily come back to them later
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
