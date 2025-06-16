import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import EditPinModal from "./EditPinModal";

// Define interfaces
interface User {
  id: string;
  username?: string;
  profileImage?: string;
  bio?: string;
  website?: string;
}

interface Pin {
  _id: string;
  title: string;
  image: string;
  description?: string;
  link?: string;
}

interface ProfilePageProps {
  profileId?: string;
  loggedInUserId?: string;
}

interface EditFormData {
  title: string;
  description: string;
  link: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  profileId,
  loggedInUserId,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [savedPins, setSavedPins] = useState<Pin[]>([]);
  const [uploadedPins, setUploadedPins] = useState<Pin[]>([]);
  const [follow, setFollow] = useState<string[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pinsLoading, setPinsLoading] = useState(false);
  const [pinsError, setPinsError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'created' | 'saved'>('created');
  
  // Edit form states
  const [editingPin, setEditingPin] = useState<Pin | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    title: '',
    description: '',
    link: ''
  });
  const [isEditLoading, setIsEditLoading] = useState(false);

  const isOwnProfile = !profileId || profileId === loggedInUserId;
  const displayUser = isOwnProfile ? user : profileUser;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser.id ? storedUser : null);

    const fetchProfileData = async () => {
      if (!storedUser.id) {
        console.warn("No user ID found in localStorage");
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/api/follow/followers/${storedUser.id}`
        );
        console.log("Followers response:", response.data);
        setFollow(response.data.followers || []);

        if (profileId && storedUser.id && profileId !== storedUser.id) {
          const isFollowingRes = await axiosInstance.get(
            `/api/follow/is-following/${storedUser.id}/${profileId}`
          );
          setIsFollowing(isFollowingRes.data.isFollowing);

          // Fetch profile user data if viewing another user's profile
          const profileRes = await axiosInstance.get(`/api/user/${profileId}`);
          setProfileUser(profileRes.data.user || null);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchProfileData();
  }, [profileId]);

  useEffect(() => {
    const fetchPins = async () => {
      if (!user?.id) {
        console.warn("User ID is undefined, skipping pin fetch");
        setPinsError("User not logged in");
        return;
      }

      setPinsLoading(true);
      setPinsError(null);

      try {
        const savedRes = await axiosInstance.get(
          `/api/user/saved-pins/${user.id}`
        );
        console.log("Saved pins response:", savedRes.data);
        setSavedPins(savedRes.data || []);

        const uploadedRes = await axiosInstance.get(
          `/api/user/pins/${user.id}`
        );
        console.log("Uploaded pins response:", uploadedRes.data);
        setUploadedPins(uploadedRes.data || []);
      } catch (err) {
        console.error("Failed to fetch pins:", err);
        setPinsError("Failed to load pins. Please try again.");
      } finally {
        setPinsLoading(false);
      }
    };

    fetchPins();
  }, [user?.id]);

  console.log("Current state:", { savedPins, uploadedPins });

  const handleFollowToggle = async () => {
    if (!user?.id || !profileId) return;
    setIsLoading(true);

    try {
      if (isFollowing) {
        await axiosInstance.post(`/api/follow/unfollow`, {
          followerId: user.id,
          followingId: profileId,
        });
        setIsFollowing(false);
        setFollow((prev) => prev.filter((id) => id !== profileId));
      } else {
        await axiosInstance.post(`/api/follow/follow`, {
          followerId: user.id,
          followingId: profileId,
        });
        setIsFollowing(true);
        setFollow((prev) => [...prev, profileId]);
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (e: React.MouseEvent, pin: Pin) => {
    e.stopPropagation(); // Prevent navigation to pin detail
    setEditingPin(pin);
    setEditFormData({
      title: pin.title || '',
      description: pin.description || '',
      link: pin.link || ''
    });
  };

  const handleEditFormChange = (field: keyof EditFormData, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPin) return;

    setIsEditLoading(true);
    try {
      const response = await axiosInstance.put(`/api/pins/${editingPin._id}`, {
        title: editFormData.title,
        description: editFormData.description,
        link: editFormData.link
      });

      // Update the pin in the appropriate array
      const updatedPin = { ...editingPin, ...editFormData };
      
      if (activeTab === 'created') {
        setUploadedPins(prev => 
          prev.map(pin => pin._id === editingPin._id ? updatedPin : pin)
        );
      } else {
        setSavedPins(prev => 
          prev.map(pin => pin._id === editingPin._id ? updatedPin : pin)
        );
      }

      setEditingPin(null);
      setEditFormData({ title: '', description: '', link: '' });
    } catch (err) {
      console.error("Error updating pin:", err);
      alert("Failed to update pin. Please try again.");
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditingPin(null);
    setEditFormData({ title: '', description: '', link: '' });
  };

  const handleDeletePin = async (pinId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to delete a pin.");
      return;
    }

    try {
      await axiosInstance.delete(`/api/pins/${pinId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the pin from the appropriate array
      if (activeTab === 'created') {
        setUploadedPins(prev => prev.filter(pin => pin._id !== pinId));
      } else {
        setSavedPins(prev => prev.filter(pin => pin._id !== pinId));
      }

      setEditingPin(null);
      alert("Pin deleted successfully.");
    } catch (err: any) {
      console.error("Error deleting pin:", err);
      alert(err.response?.data?.message || "Failed to delete pin. Please try again.");
    }
  };

  const currentPins = activeTab === 'created' ? uploadedPins : savedPins;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="pt-20 pb-8 px-4 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <img
              src={displayUser?.profileImage || "https://via.placeholder.com/120"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover shadow-lg mx-auto"
            />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            {displayUser?.username || "Guest"}
          </h1>
          {displayUser?.bio && (
            <p className="text-gray-600 text-base mb-4 max-w-md mx-auto">
              {displayUser.bio}
            </p>
          )}
          {displayUser?.website && (
            <a
              href={displayUser.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 text-sm hover:underline mb-4 block"
            >
              {displayUser.website}
            </a>
          )}
          <div className="flex justify-center gap-8 mb-6 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-900">{follow?.length || 0}</div>
              <div className="text-gray-600">following</div>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            {isOwnProfile ? (
              <button
                onClick={() => navigate("/edit-profile")}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-full transition-colors duration-200"
              >
                Edit profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleFollowToggle}
                  disabled={isLoading}
                  className={`px-6 py-3 font-semibold rounded-full transition-colors duration-200 ${
                    isFollowing
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
                </button>
                <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-full transition-colors duration-200">
                  Message
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 sticky top-16 bg-white z-10">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex justify-center space-x-8">
            <button
              onClick={() => setActiveTab('created')}
              className={`py-4 px-2 font-semibold text-sm border-b-2 transition-colors duration-200 ${
                activeTab === 'created'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Created
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`py-4 px-2 font-semibold text-sm border-b-2 transition-colors duration-200 ${
                activeTab === 'saved'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Saved
            </button>
          </nav>
        </div>
      </div>

      {/* Pins Grid */}
      <div className="px-4 py-8 max-w-7xl mx-auto">
        {pinsLoading ? (
          <div className="text-center py-20">
            <p className="text-gray-600">Loading pins...</p>
          </div>
        ) : pinsError ? (
          <div className="text-center py-20">
            <p className="text-red-600">{pinsError}</p>
          </div>
        ) : currentPins.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'created' ? 'Nothing to show...yet!' : 'No saved Pins yet'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {activeTab === 'created'
                ? "Pins you create will live here. Create your first Pin to get started!"
                : "Save your favorite ideas so you can easily come back to them later"}
            </p>
            {activeTab === 'created' && (
              <button
                className="mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-colors duration-200"
                onClick={() => navigate("/create")}
              >
                Create Pin
              </button>
            )}
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
            {currentPins.map((pin: Pin) => (
              <div
                key={pin._id}
                className="break-inside-avoid cursor-pointer group"
                onClick={() => navigate(`/pin/${pin._id}`)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-gray-100 hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={pin.image || "https://via.placeholder.com/200"}
                    alt={pin.title || "Pin"}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    style={{ aspectRatio: 'auto' }}
                  />
                  <div className="absolute inset-0 group-hover:bg-black group-hover:bg-opacity-20 transition-all duration-300" />
                  
                  {/* Edit Icon - Only show for own profile and created pins */}
                  {isOwnProfile && activeTab === 'created' && (
                    <button
                      onClick={(e) => handleEditClick(e, pin)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <svg 
                        className="w-4 h-4 text-gray-700" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                        />
                      </svg>
                    </button>
                  )}
                </div>
                {pin.title && (
                  <div className="p-2">
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
                      {pin.title}
                    </h4>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingPin && (
        <EditPinModal
          pin={editingPin}
          editFormData={editFormData}
          isEditLoading={isEditLoading}
          onEditSubmit={handleEditSubmit}
          onEditCancel={handleEditCancel}
          onEditFormChange={handleEditFormChange}
          onDelete={handleDeletePin}
        />
      )}
    </div>
  );
};

export default ProfilePage;