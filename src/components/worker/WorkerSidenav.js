"use client";
import React, { useState,useEffect } from 'react';
import useStore from "@/app/store/useStore";
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';


const Home = () => {
  const [activeMenu, setActiveMenu] = useState(); // Default active menu
  const { isDarkMode, toggleDarkMode } = useStore();
  const [notificationCount,setNotificationCount]=useState(0)
  const socket = io(`${process.env.NEXT_PUBLIC_Backend_Port}`);

  const router = useRouter();

  // Define routes for each menu item
  const menuItems = [
    { name: 'Home', route: '/worker/homepage' },
    { name: 'Status', route: '/worker/workerStatus' },
    { name: 'Wallet', route: '/worker/WorkerBalance' },
    { name: 'Chat', route: '/worker/Chatbox' }, // Route for Chatbox
    { name: 'Job', route: '/worker/services' },
    { name: 'Logout', route: '/worker/SignIn' },
  ];

  useEffect(() => {
    // Listen for new messages or notifications on the chat socket
    socket.on('newMessage', (data) => {
      // Increment notification count when a new message arrives
      setNotificationCount((prevCount) => prevCount + 1);
    });

    // Clean up the socket connection
    return () => {
      socket.off('newMessage');
      socket.disconnect();
    };
  }, [socket]);
  const handleMenuClick = (menuItem) => {
    setActiveMenu(menuItem.name);
    if (menuItem.name === 'Logout') {
      handleLogout();
    } else {
      router.push(menuItem.route);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    router.push('/worker/SignIn');
  };
  return (
    <div className="min-h-screen flex">
      {/* Side Nav */}
      <nav className="w-64 bg-white shadow-md">
        <ul className="space-y-2 py-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => handleMenuClick(item)}
                className={`relative block w-full text-left px-4 py-2 font-medium text-black hover:bg-blue-500 hover:text-white transition-colors duration-300 ${
                  activeMenu === item.name ? 'bg-blue-500 text-white' : ''
                }`}
              >
                {item.name}
                
                {/* Show notification count for Chat only */}
                {item.name === 'Chat' && notificationCount > 0 && (
                  <span className="absolute top-1 right-4 bg-red-500 text-white rounded-full text-xs px-2">
                    {notificationCount}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Home;
