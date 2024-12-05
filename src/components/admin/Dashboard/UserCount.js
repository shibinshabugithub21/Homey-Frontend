'use client'
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const UserCount = () => {
  const [userCount, setUserCount] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/getUser`);
        setUserCount(response.data.users); 
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="bg-gradient-to-r from-teal-400 to-blue-500 shadow-xl rounded-xl p-6 w-48 h-40 text-center transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl opacity-100 animate-fade-in">
      <h2 className="text-xl font-semibold text-white">No Of Users</h2>
      <p className="text-3xl font-bold text-yellow-300 mt-4">{userCount}</p>
    </div>
  );
};

export default UserCount;
