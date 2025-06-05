import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLButtonElement>(null);
  const [user, setUser] = useState<any>(null);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleArrowClick = () => {
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
        !dropdownRef.current.contains(event.target as Node) &&
        !arrowRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Show search bar and "Pinterest" text logo only on Explore page
  const showSearchAndTextLogo = location.pathname === "/explore";

  return (
    <nav className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-5 bg-white fixed top-0 left-0 right-0 z-40 shadow-sm">
      {/* Logo Section */}
      <div
        onClick={handleLogoClick}
        className="flex items-center gap-2 cursor-pointer"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png"
          alt="Pinterest Logo"
          className="w-6 h-6"
        />
        {/* ✅ Show text only on Explore page */}
        {showSearchAndTextLogo && (
          <span className="text-xl font-bold text-red-600 hidden xs:inline">
            Pinterest
          </span>
        )}
      </div>

      {/* Search Bar (Only on Explore) */}
      {showSearchAndTextLogo && (
        <div className="flex-1 hidden sm:flex justify-center">
          <div className="w-full max-w-[500px] px-4 sm:px-6">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 sm:px-5 py-2 rounded-full border-none bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm placeholder-gray-500"
            />
          </div>
        </div>
      )}

      {/* Profile Section */}
      {user && (
        <div className="relative flex items-center gap-5">
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

          <button
            ref={arrowRef}
            onClick={handleArrowClick}
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            ▼
          </button>

          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-10 mt-1 w-64 bg-white border rounded shadow-md z-50 p-4"
            >
              <p className="text-sm text-gray-500 mb-1">Currently in</p>
              <p className="font-medium text-gray-800">{user?.username}</p>
              <p className="text-sm text-gray-600 mb-4">{user?.email}</p>
              <hr className="my-2" />
              <button
                className="block w-full text-left text-sm text-red-500 px-2 py-2 hover:bg-gray-100 rounded"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
