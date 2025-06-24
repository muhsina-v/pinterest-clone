import React, { useState, useEffect } from "react";
import { ArrowLeft, Settings } from "lucide-react";

interface Category {
  id: string;
  name: string;
  image: string;
  searchTerm: string;
}

const CategorySelectionPage: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Replace with real navigation (like useNavigate from react-router-dom)
  const navigate = (path: string) => {
    console.log(`Navigating to: ${path}`);
  };

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
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      searchTerm: "health"
    },
    {
      id: "decor",
      name: "Decor",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      searchTerm: "decor"
    },
    {
      id: "fashion",
      name: "Fashion",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      searchTerm: "fashion"
    },
    {
      id: "travel",
      name: "Travel",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      searchTerm: "travel"
    },
    {
      id: "beauty",
      name: "Beauty",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      searchTerm: "beauty"
    },
    {
      id: "technology",
      name: "Technology",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      searchTerm: "technology"
    },
    {
      id: "art",
      name: "Art",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      searchTerm: "art"
    }
  ];

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("userCategories") || "[]");
    if (saved.length > 0) {
      setSelectedCategories(saved);
      setIsEditMode(true);
    }
  }, []);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleContinue = () => {
    localStorage.setItem("userCategories", JSON.stringify(selectedCategories));
    if (isEditMode) {
      alert(selectedCategories.length === 0 ? "All categories removed." : "Categories updated.");
    } else if (selectedCategories.length === 0) {
      alert("Please select at least one category to continue.");
      return;
    }
    navigate("/explore");
  };

  const handleSkip = () => {
    localStorage.setItem("userCategories", JSON.stringify([]));
    navigate("/explore");
  };

  const handleReset = () => {
    setSelectedCategories([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-9">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-9">
        {/* Header */}
        <div className="flex items-center justify-between mb-9">
          <button
            onClick={() => navigate("/explore")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            {/* <ArrowLeft size={20} />
            <span>Back</span> */}
          </button>
          {/* {isEditMode && (
            <div className="flex items-center gap-2 text-blue-600">
              <Settings size={20} />
              <span className="font-medium">Edit Mode</span>
            </div>
          )} */}
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png"
              alt="Pinterest Logo"
              className="w-8 h-8"
            />
            <span className="text-2xl font-bold text-red-600">Pinterest</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditMode ? "Update your interests" : "What are you interested in?"}
          </h1>
          <p className="text-gray-600 text-lg">
            {isEditMode
              ? "Add or remove topics to customize your feed."
              : "Choose topics to help us personalize your Pinterest experience"}
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryToggle(category.id)}
              className={`relative group overflow-hidden rounded-2xl h-32 transition-all duration-300 transform hover:scale-105 ${
                selectedCategories.includes(category.id)
                  ? "ring-4 ring-red-500 ring-opacity-70"
                  : "hover:shadow-lg"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:scale-110"
                style={{ backgroundImage: `url(${category.image})`, filter: "brightness(0.8)" }}
              />
              <div className={`absolute inset-0 ${
                selectedCategories.includes(category.id)
                  ? "bg-red-500 bg-opacity-40"
                  : " bg-opacity-30 group-hover:bg-opacity-40"
              }`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-semibold text-lg tracking-wide drop-shadow-lg text-center px-2">
                  {category.name}
                </span>
              </div>
              {selectedCategories.includes(category.id) && (
                <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="text-center mb-6">
          <p className="text-gray-600">
            {selectedCategories.length} {selectedCategories.length === 1 ? "category" : "categories"} selected
            {isEditMode && (
              <span className="block text-sm text-gray-500 mt-1">
                Click any category to add or remove it
              </span>
            )}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isEditMode ? (
            <>
              <button
                onClick={handleReset}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={handleContinue}
                className="px-8 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors"
              >
                {selectedCategories.length === 0 ? "Remove All Categories" : `Save Changes (${selectedCategories.length})`}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSkip}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
              >
                Skip for now
              </button>
              <button
                onClick={handleContinue}
                disabled={selectedCategories.length === 0}
                className={`px-8 py-3 rounded-full font-semibold transition-colors ${
                  selectedCategories.length > 0
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Continue ({selectedCategories.length})
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySelectionPage;
