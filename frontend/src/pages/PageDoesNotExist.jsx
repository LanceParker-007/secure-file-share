import React from "react";
import { FiHome } from "react-icons/fi";

const PageDoesNotExist = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
      </header>
      <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-6xl font-bold mb-4">404</h2>
          <p className="text-xl mb-8">
            Oops! The page you're looking for doesn't exist.
          </p>
          <a
            href="/"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-md inline-flex items-center"
          >
            <FiHome className="mr-2" />
            Go to Homepage
          </a>
        </div>
      </main>
    </div>
  );
};

export default PageDoesNotExist;
