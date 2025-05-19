import React from "react";
import { Home, Compass, Plus } from "lucide-react";

const Sidebar: React.FC = () => {
  return (
    <aside className="fixed top-0 left-0 h-full w-19 bg-white shadow-md pt-20 px-2 flex flex-col items-center gap-12">
      <button className="text-gray-700 hover:text-red-500">
        <Home size={26} />
      </button>

      <button className="text-gray-700 hover:text-red-500">
        <Compass size={26} />
      </button>

      <button className="text-gray-700 hover:text-red-500">
        <Plus size={26} />
      </button>
    </aside>
  );
};

export default Sidebar;
