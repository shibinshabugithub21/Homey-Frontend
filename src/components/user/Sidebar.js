'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; 
import axios from "axios";

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState("");
  const [user, setUser] = useState({});
  const router = useRouter(); 

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

  const handleLinkClick = (link) => {
    setActiveLink(link);
    if (link === "Address") {
      router.push('/profile/address'); 
    }
    else if(link === "Profile"){
      router.push('/profile')
    }
    else if(link === "Plans"){
      router.push('/Premium')
    }
  };

  const handleBackButtonClick = () => {
    router.back(); 
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token'); 
   
    router.push('/signIn');
  };
  
  return (
    <div className="p-4 bg-white shadow-lg rounded-lg"> 
      <button 
        onClick={handleBackButtonClick} 
        className="mb-4 text-blue-500 hover:text-blue-700 focus:outline-none"
      >
        &lt; Back 
      </button>
      
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
        <p className="mt-2 font-semibold">{user.fullname || 'Shibin P Shabu'}</p>
        <p className="text-sm text-gray-500">{user.email|| "shibinpshabu@gmail.com"}</p>
      </div>

      {/* Sidebar Links */}
      <ul className="mt-6 space-y-2">
        {["My Profile", "Address", "Plans", "Log Out"].map((link) => (
          <li
            key={link}
            className={`cursor-pointer p-2 rounded-md ${
              activeLink === link ? "bg-gray-300" : "hover:bg-gray-100"
            }`}
            onClick={() => {
              if (link === "Log Out") {
                handleLogout(); 
              } else {
                handleLinkClick(link); 
              }
            }}
          >
            {link}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
