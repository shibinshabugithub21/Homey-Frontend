'use client'
import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 text-center">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute bottom-0 w-12 h-12 bg-red-500 rounded-full animate-bounce"></div>
      </div>
      <h1 className="text-4xl font-semibold text-gray-800 mb-4">Oops! Page Not Found</h1>
      <p className="text-lg text-gray-600">It seems the page you are looking for doesn't exist.</p>
    </div>
  );
};

export default NotFound;
