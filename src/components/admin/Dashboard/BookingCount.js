'use client'
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const BookingCount = () => {
  const [bookingCount, setBookingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingCount = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/getBooking`);
        setBookingCount(response.data.bookings);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBookingCount();
  }, []);

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="bg-gradient-to-r from-pink-400 to-red-500 shadow-xl rounded-xl p-6 w-48 h-40 text-center transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl opacity-100 animate-fade-in">
      <h2 className="text-xl font-semibold text-white">No Of Bookings</h2>
      <p className="text-3xl font-bold text-yellow-300 mt-4">{bookingCount}</p>
    </div>
  );
};

export default BookingCount;
