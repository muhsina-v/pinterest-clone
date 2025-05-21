import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Masonry from "masonry-layout";
import imagesLoaded from 'imagesloaded';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

// Placeholder data
const placeholderPins = [
  { id: '1', imageUrl: 'https://picsum.photos/400/600', title: '' },
  { id: '2', imageUrl: 'https://picsum.photos/400/400', title: '' },
  { id: '3', imageUrl: 'https://picsum.photos/400/800', title: '' },
  { id: '4', imageUrl: 'https://picsum.photos/400/500', title: '' },
  { id: '5', imageUrl: 'https://picsum.photos/400/700', title: '' },
  { id: '6', imageUrl: 'https://picsum.photos/400/450', title: '' },
  { id: '7', imageUrl: 'https://picsum.photos/400/650', title: '' },
  { id: '8', imageUrl: 'https://picsum.photos/400/550', title: '' },
];

const ExplorePage: React.FC = () => {
  const [pins, setPins] = useState(placeholderPins);

  useEffect(() => {
    const grid = document.querySelector('.masonry-grid');
    if (grid) {
      const msnry = new Masonry(grid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        gutter: 16,
      });

      imagesLoaded(grid, () => {
        msnry.layout();
      });

      const resizeHandler = () => msnry.layout();
      window.addEventListener('resize', resizeHandler);
      return () => window.removeEventListener('resize', resizeHandler);
    }
  }, []);

  return (
    <div className="relative w-full bg-gray-100 min-h-screen">
      <div className="fixed top-0 left-0 z-20 lg:block hidden">
        <Sidebar />
      </div>

      <div className="fixed top-0 left-0 w-full z-30">
        <Navbar />
      </div>

      <main className="pt-16 sm:pt-20 lg:pl-48 lg:pt-20 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-red-900 text-center mb-8">
          Explore Ideas
        </h1>

        <div className="masonry-grid mx-auto max-w-7xl" style={{ columnGap: '0' }}>
          <div className="grid-sizer w-full sm:w-1/2 lg:w-1/4"></div>

          {pins.map((pin) => (
            <div key={pin.id} className="grid-item w-full sm:w-1/2 lg:w-1/4 mb-4">
              <Link to={`/pin/${pin.id}`} className="block">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <img
                    src={pin.imageUrl}
                    alt={pin.title}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-red-900 truncate">{pin.title}</h2>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ExplorePage;
