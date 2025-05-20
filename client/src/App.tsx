import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './component/Home';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import RegisterPage from './component/RegisterPage';
import ExplorePage from './component/Explore';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full">
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/explore" element={<ExplorePage />} />
      
      </Routes>
    </div>
  );
};

export default App;