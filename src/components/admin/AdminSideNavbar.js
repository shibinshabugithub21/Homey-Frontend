"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AdminSideNavbar = () => {
  const [activeLink, setActiveLink] = useState('home');
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setLoading(true); 

    setTimeout(() => {
      setLoading(false); 
      router.push(link); 
    }, 1000); 
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/logout`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem('access_Token');
        router.push('/admin/signIn');
      } else {
        console.error('Logout response:', data);
        alert(data.message || 'Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred during logout. Please try again.');
    }
  };

  return (
    <>
      {loading && ( 
        <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="animate-spin h-16 w-16 border-4 border-t-4 border-teal-500 rounded-full"></div>
          <span className="mt-4 text-white text-lg">Loading...</span>
        </div>
      )}

      <nav className="bg-white fixed top-0 bottom-0 left-0 w-64 p-8 z-40">
        <div className="flex items-center mb-10">
          <Link href="/" passHref>
            <img src="/logo.png" alt="Homey" />
          </Link>
        </div>

        <ul className="list-none m-0 p-0 grid gap-3">
          {[ // Navigation Links
            { name: 'Home', link: '/admin/adminHomePage' },
            { name: 'User', link: '/admin/adminUserPage' },
            { name: 'Employee', link: '/admin/adminworker' },
            { name: 'Subscription', link: '/admin/adminPremiumMagmant' },
            { name: 'Category', link: '/admin/adminCategory' },
            { name: 'Services', link: '/admin/adminServices' },
            {name:'Location',link:'/admin/adminLocation'},
            { name: 'Task', link: '/admin/adminTask' },
            { name: 'Banner & Offer', link: '/admin/adminBanner' },
            { name: 'Wallet', link: '/admin/adminWallet' },
          ].map(({ name, link }) => (
            <li key={name}>
              <Link className='no-underline' href={link} passHref>
                <div
                  onClick={() => handleLinkClick(link)} 
                  className={`block text-black font-semibold p-1 rounded-lg transition duration-200 ${
                    activeLink === name.toLowerCase() ? 'bg-teal-600 shadow-lg text-white' : 'hover:bg-teal-500 hover:shadow-md'
                  }`}
                  style={{ textDecoration: 'none' }}
                >
                  {name}
                </div>
              </Link>
            </li>
          ))}
          <li>
            <div
              onClick={handleLogout}
              className="block text-black font-semibold p-4 rounded-lg transition duration-200 hover:bg-teal-500 hover:shadow-md cursor-pointer"
            >
              Logout
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default AdminSideNavbar;
