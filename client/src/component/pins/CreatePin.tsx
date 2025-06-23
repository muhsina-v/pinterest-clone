import React, { useState, useEffect } from "react";
import { Upload, Plus, ChevronDown } from "lucide-react";
import axiosInstence from "../../utils/axios";

const CreatePin: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  const categories = [
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
    }
  ];

  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    console.log(objectUrl)
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!image) {
      setMessage("Please upload an image");
      return;
    }

    if (!category) {
      setMessage("Please select a category");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("link", link);
    formData.append("image", image);
    formData.append("category", category);

    try {
      const token = localStorage.getItem("token");

     let respose = await axiosInstence.post("http://localhost:3000/api/user/pin", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
    
        },
      });
      console.log(respose)

      setMessage("Pin uploaded successfully!");
      setTitle("");
      setDescription("");
      setLink("");
      setImage(null);
      alert("success")
      setCategory("");

    } catch (error: any) {
      setMessage(error.response?.data?.message || "Something went wrong");
      console.log(error);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setCategory(categoryId);
    setIsDropdownOpen(false);
  };

  const selectedCategory = categories.find(cat => cat.id === category);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-30 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8 text-center">
          Create Pin
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Image Upload Section */}
              <div className="lg:w-2/5 p-6 lg:p-8">
                <div className="aspect-[3/4] max-w-[300px] mx-auto">
                  {preview ? (
                    <div className="relative w-full h-full group">
                      <img
                        src={preview}
                        alt="preview"
                        className="w-full h-full object-cover rounded-2xl"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-2xl flex items-center justify-center">
                        <label className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              if (e.target.files && e.target.files.length > 0) {
                                setImage(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />
                          <div className="bg-white rounded-full p-3 shadow-lg">
                            <Upload className="w-5 h-5 text-gray-700" />
                          </div>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-gray-400 transition-colors bg-gray-50 hover:bg-gray-100">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setImage(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center text-gray-500 px-6 text-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                          <Plus className="w-6 h-6" />
                        </div>
                        <p className="text-lg font-medium mb-2">Choose a file</p>
                        <p className="text-sm text-gray-400 mb-4">or drag and drop it here</p>
                        <div className="text-xs text-gray-400">
                          <p>We recommend using high quality .jpg files</p>
                          <p>less than 20MB</p>
                        </div>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Form Section */}
              <div className="lg:w-3/5 p-6 lg:p-8 lg:border-l border-gray-200">
                <div className="space-y-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Add your title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full text-xl md:text-2xl font-medium placeholder-gray-400 border-0 border-b-2 border-gray-200 focus:border-red-500 focus:outline-none py-3 bg-transparent"
                      required
                    />
                  </div>

                  {/* Category Dropdown */}
                  <div className="relative">
                    <div
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full text-base placeholder-gray-400 border-0 border-b-2 border-gray-200 focus:border-red-500 py-3 bg-transparent cursor-pointer flex items-center justify-between"
                    >
                      <span className={selectedCategory ? "text-gray-900" : "text-gray-400"}>
                        {selectedCategory ? selectedCategory.name : "Select a category"}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                    
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                        {categories.map((cat) => (
                          <div
                            key={cat.id}
                            onClick={() => handleCategorySelect(cat.id)}
                            className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-10 h-10 rounded-lg object-cover mr-3"
                            />
                            <span className="text-gray-900 font-medium">{cat.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <textarea
                      placeholder="Tell everyone what your Pin is about"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full text-base placeholder-gray-400 border-0 border-b-2 border-gray-200 focus:border-red-500 focus:outline-none py-3 bg-transparent resize-none h-20"
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Add a destination link"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      className="w-full text-base placeholder-gray-400 border-0 border-b-2 border-gray-200 focus:border-red-500 focus:outline-none py-3 bg-transparent"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-base font-semibold transition-colors"
                    >
                      Publish
                    </button>
                  </div>

                  {message && (
                    <div className={`text-sm p-3 rounded-lg ${
                      message.includes('successfully') 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePin;