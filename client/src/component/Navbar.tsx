import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-5 bg-white  fixed top-0 left-0 right-0 z-10">

      <div className="flex items-center gap-2">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png"
          alt="Pinterest Logo"
          className="w-6 h-6"
        />
        <span className="text-xl font-bold text-red-600">Pinterest</span>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="w-[500px]">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-5 py-2 rounded-full border-none bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm placeholder-gray-500"
          />
        </div>
      </div>

   
      <div className="flex items-center gap-4">
        <img
          src="s"
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </nav>
  );
};

export default Navbar;
