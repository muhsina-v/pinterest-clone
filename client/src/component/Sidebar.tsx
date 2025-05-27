import React from "react";
import { Home, Compass, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <Home size={26} />, path: "/", label: "Home" },
    { icon: <Compass size={26} />, path: "/explore", label: "Explore" },
    { icon: <Plus size={26} />, path: "/create-pin", label: "Create" },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-20 bg-white shadow-md pt-20 px-2 flex flex-col items-center gap-12">
      {navItems.map((item, index) => (
        <button
          key={index}
          onClick={() => navigate(item.path)}
          className={`text-gray-700 hover:text-red-500 transition-colors ${
            location.pathname === item.path ? "text-red-500" : ""
          }`}
          title={item.label}
        >
          {item.icon}
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;
