import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleProfileClick = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("user");
      setUser(null);
      window.dispatchEvent(new Event("userUpdated"));
      navigate("/");
    }
  };

  useEffect(() => {
    const loadUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      setUser(storedUser);
    };

    loadUser();
    window.addEventListener("userUpdated", loadUser);

    return () => window.removeEventListener("userUpdated", loadUser);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-5 bg-white fixed top-0 left-0 right-0 z-40 shadow-sm">
      {/* Logo */}
      <div
        onClick={handleLogoClick}
        className="flex items-center gap-2 cursor-pointer"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png"
          alt="Pinterest Logo"
          className="w-6 h-6"
        />
        <span className="text-xl font-bold text-red-600 hidden sm:inline">
          Pinterest
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 hidden sm:flex justify-center">
        <div className="w-full max-w-[500px] px-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 rounded-full border-none bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm placeholder-gray-500"
          />
        </div>
      </div>

      {/* Profile dropdown */}
      {user && (
        <div className="relative" ref={dropdownRef}>
          <img
            onClick={handleProfileClick}
            src={
              user?.profileImage
                ? user.profileImage
                : "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"
            }
            alt="Profile"
            className="w-8 h-8 rounded-full cursor-pointer object-cover"
          />

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => navigate("/profile")}
              >
                Profile
              </button>

              <button
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
