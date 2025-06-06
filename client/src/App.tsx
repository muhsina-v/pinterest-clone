import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./component/Home";
import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar";
import RegisterPage from "./component/RegisterPage";
import ExplorePage from "./component/Explore";
import ProfilePage from "./component/profile/Profile";
import EditProfilePage from "./component/profile/EditProfile";
import CreatePin from "./component/pins/CreatePin";
import ProtectedRoute from "./component/ProtectedRoute";
import PinDetailPage from "./component/pins/PinDetailPage";

const App: React.FC = () => {
  const location = useLocation(); // 👈 Get current route path

  return (
    <div className="relative min-h-screen w-full">
      <Navbar />
      
      {/* 👇 Hide sidebar if route is "/" */}
      {location.pathname !== "/" && <Sidebar />}

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <ExplorePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-pin"
          element={
            <ProtectedRoute>
              <CreatePin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="/pin/:id" element={<PinDetailPage />} />

      </Routes>
    </div>
  );
};

export default App;
