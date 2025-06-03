import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import backgroundImage from '../assets/images/background.jpeg';
import LoginForm from '../component/Login';
const HomePage: React.FC = () => {
  return (
    <div className="relative w-full">
      {/* First*/}
      <div className="relative min-h-screen w-full">
        <div className="fixed top-0 left-0 z-20">
          <Sidebar />
        </div>

        <div className="fixed top-0 left-0 w-full z-30">
          <Navbar />
        </div>

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

        <main className="pl-48 pt-20 relative z-10 flex items-center justify-between h-screen px-20">
          <div className="text-red-900 max-w-md">
            <h1 className="text-7xl font-bold leading-snug">
              Login to get your ideas
            </h1>
          </div>

          <LoginForm />
        </main>
      </div>

      {/* Second*/}
      <div className="relative min-h-screen w-full bg-red-100">
        <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-center z-0">
          <img
            src="https://pinterest-clone-sahad.vercel.app/_next/image?url=%2Fblue-img-1.png&w=1920&q=75"
            alt="Second Pinterest Background"
            className="max-w-md w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        <main className="pl-48 pt-20 relative z-10 flex items-center h-screen px-20">
          <div className="w-1/2 flex flex-col items-center justify-center text-center">
            <h1 className="text-6xl font-bold leading-snug text-red-900">
              See it, make it,<br />try it, do it
            </h1>
            <p className="mt-4 text-lg text-red-900 max-w-md">
              The best part of Pinterest is discovering new things and ideas from people around the world.
            </p>
            <Link
              to="/explore"
              className="mt-6 bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
            >
              Explore
            </Link>
          </div>
        </main>
      </div>

      {/*3rd*/}
      <div className="relative min-h-screen w-full bg-[#DAFFF6]">
        <div className="absolute left-0 top-0 h-full w-1/2 flex items-center justify-center z-0">
          <img
            src="https://pinterest-clone-sahad.vercel.app/_next/image?url=%2FBlueHome.png&w=1920&q=75"
            alt="Third Pinterest Background"
            className="max-w-md w-full h-auto rounded-lg"
          />
        </div>

        <main className="pl-48 pt-20 relative z-10 flex items-center h-screen px-20">
          <div className="w-1/2 ml-auto flex flex-col items-center justify-center text-center">
            <h1 className="text-6xl font-bold leading-snug text-red-900">
              Create, share,<br />inspire
            </h1>
            <p className="mt-4 text-lg text-red-900 max-w-md">
              Join a global community to share your passions and inspire others with your creations.
            </p>
            <Link
              to="/explore"
              className="mt-6 bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
            >
              Explore
            </Link>
          </div>
        </main>
      </div>

      {/*4th*/}
      <div className="relative min-h-screen w-full bg-[#FFFD92]">
        <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-center z-0">
          <img
            src="https://pinterest-clone-sahad.vercel.app/_next/image?url=%2FYellowHome.png&w=1920&q=75"
            alt="Fourth Pinterest Background"
            className="max-w-md w-full h-auto rounded-lg"
          />
        </div>

        <main className="pl-48 pt-20 relative z-10 flex items-center h-screen px-20">
          <div className="w-1/2 flex flex-col items-center justify-center text-center">
            <h1 className="text-6xl font-bold leading-snug text-red-900">
              Discover, save,<br />repeat
            </h1>
            <p className="mt-4 text-lg text-red-900 max-w-md">
              Find inspiration, save your favorite ideas, and revisit them anytime to fuel your creativity.
            </p>
            <Link
              to="/explore"
              className="mt-6 bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
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