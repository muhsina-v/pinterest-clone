
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
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

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleExploreClick = () => {
    navigate("/explore");
  };

  const handleCreateClick = () => {
    navigate("/create-pin");
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

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Mock search suggestions - replace with actual API call
    if (value.trim()) {
      const mockSuggestions = [
        `${value} ideas`,
        `${value} inspiration`,
        `${value} design`,
        `${value} diy`,
        `${value} recipes`,
      ].filter(suggestion => suggestion.toLowerCase().includes(value.toLowerCase()));
      setSearchSuggestions(mockSuggestions.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
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

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white fixed top-0 left-0 right-0 z-40 shadow-sm border-b border-gray-100">
      {/* Logo */}
      <div
        onClick={handleLogoClick}
        className="flex items-center gap-2 cursor-pointer p-3 hover:bg-gray-100 rounded-full transition-colors"
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

      {/* Navigation Links and Search Bar - Only show when logged in */}
      {user && (
        <>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={handleHomeClick}
              className={`px-4 py-3 rounded-full font-semibold transition-colors ${
                isActive("/") || isActive("/home")
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Home
            </button>
            <button
              onClick={handleExploreClick}
              className={`px-4 py-3 rounded-full font-semibold transition-colors ${
                isActive("/explore")
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Explore
            </button>
            <button
              onClick={handleCreateClick}
              className={`px-4 py-3 rounded-full font-semibold transition-colors ${
                isActive("/create")
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Create
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search for ideas"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => searchQuery && setShowSuggestions(true)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border-none bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                />
              </div>
            </form>

            {/* Search Suggestions */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-lg border border-gray-200 py-2 z-50">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <span className="text-gray-900">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Right Side - Profile & Actions */}
      {user ? (
        <div className="flex items-center gap-2">
          {/* Profile */}
          <div className="relative">
            <img
              onClick={handleProfileClick}
              src={
                user?.profileImage ||
                "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"
              }
              alt="Profile"
              className="w-9 h-9 rounded-full cursor-pointer object-cover hover:shadow-md transition-shadow"
            />
          </div>

          {/* Dropdown Arrow */}
          <button
            ref={arrowRef}
            onClick={handleArrowClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg 
              className={`w-4 h-4 text-gray-600 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-12 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Currently in</p>
                <div className="flex items-center gap-3">
                  <img
                    src={user?.profileImage || "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{user?.username}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="py-2">
                <button
                  onClick={handleProfileClick}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-900">View profile</span>
                </button>
                
                <button className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-900">Settings</span>
                </button>
              </div>

              <div className="border-t border-gray-100 py-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-gray-900"
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-full font-semibold transition-colors"
          >
            Sign up
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;