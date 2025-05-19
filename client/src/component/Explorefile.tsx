import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import backgroundImage from '../assets/images/background.jpeg';

const HomePage: React.FC = () => {
  // Placeholder image URLs for the grid (replace with your own images)
  const images = [
    'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    'https://images.unsplash.com/photo-1521747116042-5a8106dc26a1',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    'https://images.unsplash.com/photo-1484417894907-623942c8ee29',
    'https://images.unsplash.com/photo-1516321497487-e288fb19713f',
    'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba',
  ];

  return (
    <div className="relative w-full">
      {/* Full-screen section with background image */}
      <div className="relative min-h-screen w-full">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 z-20">
          <Sidebar />
        </div>

        {/* Navbar */}
        <div className="fixed top-0 left-0 w-full z-30">
          <Navbar />
        </div>

        {/* Background image with blur */}
        <div className="absolute inset-0 -z-10">
          <img
            src={backgroundImage}
            alt="Pinterest Background"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(4px)',
            }}
          />
        </div>

        {/* Main content area */}
        <main className="pl-48 pt-20 relative z-10 flex items-center justify-between h-screen px-20">
          {/* Left side - Text */}
          <div className="text-red-900 max-w-md">
            <h1 className="text-7xl font-bold leading-snug">
              Login to get your ideas
            </h1>
          </div>

          {/* Right side - Login form */}
          <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-8 max-w-sm w-full">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 mb-6">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png"
                alt="Pinterest Logo"
                className="w-6 h-6"
              />
              <span className="text-xl font-bold text-red-600">Pinterest</span>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-black">Log in</h2>

            <form className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="password"
                placeholder="Password"
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
              >
                Log In
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-500 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </main>
      </div>

      {/* Scrollable image grid section */}
      <section className="bg-gray-100 py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Explore Ideas
          </h2>
          {/* Masonry grid using CSS columns */}
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
            {images.map((src, index) => (
              <div key={index} className="mb-4 break-inside-avoid">
                <img
                  src={src}
                  alt={`Pin ${index + 1}`}
                  className="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  style={{ display: 'block' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;