import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './component/Home';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import RegisterPage from './component/RegisterPage';
import ExplorePage from './component/Explore';
import ProfilePage from './component/profile/Profile';
import EditProfilePage from './component/profile/EditProfile';
import CreatePin from './component/pins/CreatePin';
import AllPins from './component/pins/AllPins';



const App: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full">
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/explore" element={<ExplorePage />} />

        <Route path="/profile" element={<ProfilePage/>} />
       <Route path="/create-pin" element={<CreatePin />} />
         <Route path='/allpin' element={<AllPins />}/>



<Route path="/edit-profile" element={<EditProfilePage />} />

      
      </Routes>
    </div>
  );
};

export default App;