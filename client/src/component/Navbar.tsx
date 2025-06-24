import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  image: string;
  searchTerm: string;
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);

  const categories: Category[] = [
    {
      id: "food",
      name: "Food",
      image: "https://www.shutterstock.com/image-photo/assortment-vibrant-gourmet-dishes-showcasing-260nw-2473449039.jpg",
      searchTerm: "food"
    },
    {
      id: "health",
      name: "Health",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      searchTerm: "health"
    },
    {
      id: "decor",
      name: "Decor",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      searchTerm: "decor"
    },
    {
      id: "fashion",
      name: "Fashion",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      searchTerm: "fashion"
    },
    {
      id: "travel",
      name: "Travel",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      searchTerm: "travel"
    },
    {
      id: "beauty",
      name: "Beauty",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      searchTerm: "beauty"
    }
  ];

  console.log("user", user);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleProfileClick = (id:string) => {
    console.log("id",id)
    navigate(`/profile/${id}`);
    
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
    console.log("query",query);
    
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
      setShowCategories(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
   
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
      setShowCategories(false);
    } else {
      setShowSuggestions(false);
      setShowCategories(true);
    }
  };

  const handleSearchFocus = () => {
    if (!searchQuery.trim()) {
      setShowCategories(true);
      setShowSuggestions(false);
    } else {
      setShowSuggestions(true);
      setShowCategories(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleCategoryClick = (category: Category) => {
    setSearchQuery(category.searchTerm);
    handleSearch(category.searchTerm);
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
        setShowCategories(false);
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

   
      {user && (
        <>
          <div className="hidden md:flex items-center gap-2">
            {/* <button
              onClick={handleHomeClick}
              className={`px-4 py-3 rounded-full font-semibold transition-colors ${
                isActive("/") || isActive("/home")
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Home
            </button> */}
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
                  onFocus={handleSearchFocus}
                  className="w-full pl-12 pr-4 py-3 rounded-full border-none bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                />
              </div>
            </form>

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

           
            {showCategories && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse categories</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category)}
                        className="relative group overflow-hidden rounded-2xl h-32 transition-transform hover:scale-105"
                      >
                 
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:scale-110"
                          style={{
                            backgroundImage: `url(${category.image})`,
                            filter: 'blur(0.5px)'
                          }}
                        />
                        
                        <div className="absolute inset-0 bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-300" />
                        
                        {/* Category Name */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white font-semibold text-lg tracking-wide drop-shadow-lg">
                            {category.name}
                          </span>
                        </div>
                        
                        {/* Hover Effect */}
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-white group-hover:border-opacity-50 rounded-2xl transition-all duration-300" />
                      </button>
                    ))}
                  </div>
                  
                  {/* Popular searches
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-600 mb-3">Popular on Pinterest</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Christmas", "Recipes", "Home decor", "Outfits", "Hairstyles"].map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearch(term)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div> */}
                </div>
              </div>
            )}
          </div>
        </>
      )}


      {user ? (
        <div className="flex items-center gap-2">
          {/* Profile */}
          <div className="relative">
            <img
              onClick={()=>handleProfileClick(user._id)}
              src={
                user?.profileImage ||
                "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"
              }
              alt="Profile"
              className="w-9 h-9 rounded-full cursor-pointer object-cover hover:shadow-md transition-shadow"
            />
          </div>

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
  onClick={() => handleProfileClick(user?.id)}
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
            onClick={() => navigate("/register")}
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