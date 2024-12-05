// Pagination.js
import React from 'react';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleClick = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    onPageChange(pageNumber);
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-300 rounded mx-1"
      >
        Previous
      </button>
      {[...Array(totalPages).keys()].map((number) => (
        <button
          key={number + 1}
          onClick={() => handleClick(number + 1)}
          className={`px-4 py-2 rounded mx-1 ${
            currentPage === number + 1 ? 'bg-teal-600 text-white' : 'bg-gray-300'
          }`}
        >
          {number + 1}
        </button>
      ))}
      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-300 rounded mx-1"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
