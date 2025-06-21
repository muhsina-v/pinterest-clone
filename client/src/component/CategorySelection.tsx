import React, { useState } from "react";

interface Category {
  id: string;
  name: string;
  image: string;
  searchTerm: string;
}

const CategorySelectionPage: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Categories data with high-quality images (same as in navbar)
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
      searchTerm: "home"
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
    },
    {
      id: "diy",
      name: "DIY & Crafts",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      searchTerm: "diy"
    },
    {
      id: "photography",
      name: "Photography",
      image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      searchTerm: "photography"
    }
  ];

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleContinue = () => {
    if (selectedCategories.length === 0) {
      alert("Please select at least one category to continue");
      return;
    }

    // Save selected categories to localStorage
    localStorage.setItem("userCategories", JSON.stringify(selectedCategories));
    
    // Simulate navigation to explore page
    console.log("Selected categories:", selectedCategories);
    alert(`Categories saved! Selected: ${selectedCategories.join(", ")}`);
  };

  const handleSkip = () => {
    // Save empty array to indicate user skipped
    localStorage.setItem("userCategories", JSON.stringify([]));
    console.log("User skipped category selection");
    alert("Skipped category selection. All pins will be shown.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-8">
        {/* Header */}
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
            What are you interested in?
          </h1>
          <p className="text-gray-600 text-lg">
            Choose topics to help us personalize your Pinterest experience
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryToggle(category.id)}
              className={`relative group overflow-hidden rounded-2xl h-32 transition-all duration-300 transform hover:scale-105 ${
                selectedCategories.includes(category.id)
                  ? 'ring-4 ring-red-500 ring-opacity-70'
                  : 'hover:shadow-lg'
              }`}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${category.image})`,
                  filter: 'brightness(0.8)'
                }}
              />
              
              {/* Overlay */}
              <div className={`absolute inset-0 transition-all duration-300 ${
                selectedCategories.includes(category.id)
                  ? 'bg-red-500 bg-opacity-40'
                  : ' bg-opacity-30 group-hover:bg-opacity-40'
              }`} />
              
              {/* Category Name */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-semibold text-lg tracking-wide drop-shadow-lg text-center px-2">
                  {category.name}
                </span>
              </div>
              
              {/* Selection Indicator */}
              {selectedCategories.includes(category.id) && (
                <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Selection Counter */}
        <div className="text-center mb-6">
          <p className="text-gray-600">
            {selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'} selected
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue ({selectedCategories.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategorySelectionPage;