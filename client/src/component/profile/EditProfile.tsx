import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();

  // Get user data from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [formData, setFormData] = useState({
    username: storedUser.username || "",
    bio: storedUser.bio || "",
    website: storedUser.website || "",
    profileImage: storedUser.profileImage || "https://via.placeholder.com/80",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUser = { ...storedUser, ...formData };

    // Save updated user to localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Navigate back to profile page
    navigate("/profile");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 pt-24">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-6 text-center">Edit Profile</h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={formData.profileImage}
            alt="Profile Preview"
            className="w-24 h-24 rounded-full object-cover mb-2"
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {/* Username */}
        <label className="block mb-4">
          <span className="text-gray-700">Username</span>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-400 focus:outline-none"
            required
          />
        </label>

        {/* Bio */}
        <label className="block mb-4">
          <span className="text-gray-700">Bio</span>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
        </label>

        {/* Website */}
        <label className="block mb-6">
          <span className="text-gray-700">Website</span>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
        </label>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
