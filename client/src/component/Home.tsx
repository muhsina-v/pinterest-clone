import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import backgroundImage from "../assets/images/background.jpeg";
import LoginForm from "./Login";
import { useEffect } from "react";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (user) {
      navigate('/explore', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="relative w-full">
      {/* First Section */}
      <div className="relative min-h-screen w-full">
        <div className="fixed top-0 left-0 w-full z-30">
          <Navbar />
        </div>

        <div className="absolute inset-0 -z-10">
          <img
            src={backgroundImage}
            alt="Pinterest Background"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(4px)",
            }}
          />
        </div>

        <main className="relative z-10 flex flex-col lg:flex-row items-center justify-between min-h-screen pt-20 px-4 sm:px-6 lg:px-20 lg:pl-48">
          <div className="text-red-900 max-w-md mb-8 lg:mb-0 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-snug">
              Login to get your ideas
            </h1>
          </div>

          <div className="w-full max-w-md lg:w-auto">
            <LoginForm />
          </div>
        </main>
      </div>

      {/* Second Section */}
      <div className="relative min-h-screen w-full bg-red-100">
        <div className="absolute right-0 top-0 h-full w-full lg:w-1/2 flex items-center justify-center z-0 opacity-20 lg:opacity-100">
          <img
            src="https://pinterest-clone-sahad.vercel.app/_next/image?url=%2Fblue-img-1.png&w=1920&q=75"
            alt="Second Pinterest Background"
            className="max-w-xs sm:max-w-sm lg:max-w-md w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        <main className="relative z-10 flex items-center min-h-screen pt-20 px-4 sm:px-6 lg:px-20 lg:pl-48">
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-snug text-red-900">
              See it, make it,
              <br />
              try it, do it
            </h1>
            <p className="mt-4 text-base sm:text-lg text-red-900 max-w-md px-4 lg:px-0">
              The best part of Pinterest is discovering new things and ideas
              from people around the world.
            </p>
            <Link
              to="/explore"
              className="mt-6 bg-red-500 text-white py-3 px-8 rounded-md hover:bg-red-600 transition text-base sm:text-lg"
            >
              Explore
            </Link>
          </div>
        </main>
      </div>

      {/* Third Section */}
      <div className="relative min-h-screen w-full bg-[#DAFFF6]">
        <div className="absolute left-0 top-0 h-full w-full lg:w-1/2 flex items-center justify-center z-0 opacity-20 lg:opacity-100">
          <img
            src="https://pinterest-clone-sahad.vercel.app/_next/image?url=%2FBlueHome.png&w=1920&q=75"
            alt="Third Pinterest Background"
            className="max-w-xs sm:max-w-sm lg:max-w-md w-full h-auto rounded-lg"
          />
        </div>

        <main className="relative z-10 flex items-center min-h-screen pt-20 px-4 sm:px-6 lg:px-20 lg:pl-48">
          <div className="w-full lg:w-1/2 lg:ml-auto flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-snug text-red-900">
              Create, share,
              <br />
              inspire
            </h1>
            <p className="mt-4 text-base sm:text-lg text-red-900 max-w-md px-4 lg:px-0">
              Join a global community to share your passions and inspire others
              with your creations.
            </p>
            <Link
              to="/explore"
              className="mt-6 bg-red-500 text-white py-3 px-8 rounded-md hover:bg-red-600 transition text-base sm:text-lg"
            >
              Explore
            </Link>
          </div>
        </main>
      </div>

      {/* Fourth Section */}
      <div className="relative min-h-screen w-full bg-[#FFFD92]">
        <div className="absolute right-0 top-0 h-full w-full lg:w-1/2 flex items-center justify-center z-0 opacity-20 lg:opacity-100">
          <img
            src="https://pinterest-clone-sahad.vercel.app/_next/image?url=%2FYellowHome.png&w=1920&q=75"
            alt="Fourth Pinterest Background"
            className="max-w-xs sm:max-w-sm lg:max-w-md w-full h-auto rounded-lg"
          />
        </div>

        <main className="relative z-10 flex items-center min-h-screen pt-20 px-4 sm:px-6 lg:px-20 lg:pl-48">
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-snug text-red-900">
              Discover, save,
              <br />
              repeat
            </h1>
            <p className="mt-4 text-base sm:text-lg text-red-900 max-w-md px-4 lg:px-0">
              Find inspiration, save your favorite ideas, and revisit them
              anytime to fuel your creativity.
            </p>
            <Link
              to="/explore"
              className="mt-6 bg-red-500 text-white py-3 px-8 rounded-md hover:bg-red-600 transition text-base sm:text-lg"
            >
              Explore
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;