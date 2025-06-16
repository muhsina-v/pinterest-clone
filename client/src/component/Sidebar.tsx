import React from "react";
import {  Compass, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    // { icon: <Home size={24} />, path: "/", label: "Home" },
    { icon: <Compass size={24} />, path: "/explore", label: "Explore" },
    { icon: <Plus size={24} />, path: "/create-pin", label: "Create" }
  ];

  return (
    <>
      {/* Desktop Sidebar - Left side */}
      <aside className="hidden md:flex fixed top-0 left-0 h-full w-20 bg-white shadow-sm border-r border-gray-200 pt-20 flex-col items-center gap-4 z-30">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className={`p-4 rounded-full transition-colors hover:bg-gray-100 ${
              location.pathname === item.path 
                ? "bg-black text-white hover:bg-black" 
                : "text-gray-600 hover:text-gray-900"
            }`}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-sm z-30">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                location.pathname === item.path 
                  ? "text-black" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;