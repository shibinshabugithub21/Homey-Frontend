'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from './Sidebar'; 
import ChangePassword from "./ChangePassword";

const ProfileDetails = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let id = localStorage.getItem('userId')
        console.log('user id is', id);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/userProfile/${id}`);
        console.log("user", response.data.user);
        
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar Section */}
      <div className="w-1/4 ">
        <Sidebar />
      </div>

      <div className="w-3/4 p-6">

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <div className="w-28 h-28 bg-gray-300 rounded-full"></div>
            <div className="ml-4">
              <p className="text-xl font-bold">{user.fullname || 'full name'}</p>
              <p className="text-sm text-gray-600">{user.email || 'email'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { label: "Full Name", value: user.fullname || 'Full name' },
              { label: "Email", value: user.email || 'email' },
              { label: "Mobile Number", value: user.phone || 'phone' },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                  type="text"
                  value={value}
                  disabled
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                />
              </div>
            ))}
          </div>
          <div className="p-6 bg-gray-50 rounded-lg shadow-sm"> 
            <ChangePassword />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
