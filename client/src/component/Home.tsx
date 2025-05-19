import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import backgroundImage from '../assets/images/background.jpeg';

// Import a second background image (replace with your own image)
import secondBackgroundImage from '../assets/images/second-background.jpeg';

const HomePage: React.FC = () => {
  return (
    <div className="relative w-full">
      {/* First full-screen section */}
      <div className="relative min-h-screen w-full">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 z-20">
          <Sidebar />
        </div>

        {/* Navbar */}
        <div className="fixed top-0 left-0 w-full z-30">
          <Navbar />
        </div>

        {/* First background image with blur */}
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

      {/* Second full-screen section */}
      <div className="relative min-h-screen w-full">
        {/* Second background image with blur */}
        <div className="absolute inset-0 -z-10">
          <img
            src={secondBackgroundImage}
            alt="Second Pinterest Background"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(4px)',
            }}
          />
        </div>

        {/* Content for second section */}
        <main className="pl-48 pt-20 relative z-10 flex items-center justify-between h-screen px-20">
          {/* Left side - Text */}
          <div className="text-red-900 max-w-md">
            <h1 className="text-7xl font-bold leading-snug">
              Discover new inspirations
            </h1>
          </div>

          {/* Right side - Call to action */}
          <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4 text-black">Get Started</h2>
            <p className="text-gray-600 mb-6">
              Join Pinterest to explore and save ideas for your next project.
            </p>
            <Link
              to="/register"
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition text-center block"
            >
              Sign Up
            </Link>
          </div>
        </main>
        <div>
          <img src="/_next/image?url=%2Fblue-img-1.png&w=640&q=75 640w, /_next/image?url=%2Fblue-img-1.png&w=750&q=75 750w, /_next/image?url=%2Fblue-img-1.png&w=828&q=75 828w, /_next/image?url=%2Fblue-img-1.png&w=1080&q=75 1080w, /_next/image?url=%2Fblue-img-1.png&w=1200&q=75 1200w, /_next/image?url=%2Fblue-img-1.png&w=1920&q=75 1920w, /_next/image?url=%2Fblue-img-1.png&w=2048&q=75 2048w, /_next/image?url=%2Fblue-img-1.png&w=3840&q=75 3840w" alt="" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;