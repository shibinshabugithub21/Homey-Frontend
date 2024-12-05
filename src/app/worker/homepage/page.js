// app/page.js or wherever appropriate
'use client';

import React, { useState, useEffect } from 'react';
import WorkerSidenav from '@/components/worker/WorkerSidenav';
import HomeContent from '@/components/worker/HomeContent';
import WorkerNavbar from '@/components/worker/WorkerNavbar';
import Footer from '@/components/footer';
import { useRouter } from 'next/navigation';
import jwtDecode from 'jwt-decode'; 

const Page = () => {
  const [activeMenu, setActiveMenu] = useState('Home'); 
  const router = useRouter();

  useEffect(() => {
    const checkBlockStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const workerId = localStorage.getItem('workerId'); // Retrieve worker ID
        console.log("worker_id",workerId);
        
        if (!token || !workerId) {
          router.push('/worker/SignIn'); // Redirect if no token
          return;
        }
  
        const decoded = jwtDecode(token);
        const userId = decoded.id;
  
        const res = await fetch(`http://localhost:5000/worker/getWorker/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (res.status === 403) {
          alert('Your account has been blocked. Please contact support.');
          localStorage.removeItem("token");
          router.push('/worker/SignIn');
        } else if (res.status === 404) {
          alert('Your account has been deleted by the admin.');
          localStorage.removeItem("token");
          router.push('/worker/SignIn');
        }
      } catch (error) {
        console.error('Error checking block status:', error);
      }
    };
  
    checkBlockStatus();
  }, [router]);
  
  const handleMenuClick = (menuItem) => {
    setActiveMenu(menuItem);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <WorkerNavbar />
      <div className="flex flex-1">
        <WorkerSidenav activeMenu={activeMenu} onMenuClick={handleMenuClick} />
        <HomeContent activeMenu={activeMenu} />
      </div>
        <Footer/>
    </div>
  );
};

export default Page;
