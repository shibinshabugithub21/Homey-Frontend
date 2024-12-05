// src/components/TopRatedServices.js
import React from 'react';

const TopRatedServices = () => {
  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-center text-teal-600 mb-8">
          Top Rated Services
        </h2>
        
        {/* Top Rated Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Top Service 1 */}
          <div className="bg-gray-100 shadow-md p-6 rounded-lg">
            <img src="/plumber.png" alt="Cleaning Service" className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-center text-gray-800">Cleaning</h3>
            <p className="text-center text-gray-600 mb-4">
              Reliable and thorough cleaning services with 5-star ratings.
            </p>
            <div className="flex justify-center text-yellow-500">
              {/* Star Rating */}
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </div>
          </div>

          {/* Top Service 2 */}
          <div className="bg-gray-100 shadow-md p-6 rounded-lg">
            <img src="/plumber.png" alt="AC Repair Service" className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-center text-gray-800">AC Repair</h3>
            <p className="text-center text-gray-600 mb-4">
              Expert AC repairs with excellent customer reviews.
            </p>
            <div className="flex justify-center text-yellow-500">
              {/* Star Rating */}
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star-half-alt"></i>
            </div>
          </div>

          {/* Top Service 3 */}
          <div className="bg-gray-100 shadow-md p-6 rounded-lg">
            <img src="/plumber.png" alt="Gardening Service" className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-center text-gray-800">Gardening</h3>
            <p className="text-center text-gray-600 mb-4">
              High-quality gardening services rated top by customers.
            </p>
            <div className="flex justify-center text-yellow-500">
              {/* Star Rating */}
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopRatedServices;
