import React from 'react';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {

  
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-8 max-w-sm w-full">
        <div className="flex items-center gap-2 mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png"
            alt="Pinterest Logo"
            className="w-6 h-6"
          />
          <span className="text-xl font-bold text-red-600">Pinterest</span>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-black">Sign Up</h2>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
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
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;