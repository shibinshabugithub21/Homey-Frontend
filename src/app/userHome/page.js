"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import IndividualIntervalsExample from '@/components/Carousel'; 
import OfferText from '@/components/offer';
import Services from '@/components/Services';
import TopRatedServices from '@/components/TopServices';
import UserReviews from '@/components/userReview';
import Footer from '@/components/footer';
import ReduxProvider from '../ReduxProvider';
import ChatApp from '@/components/user/chat/userChat';
import { AiOutlineUser } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5'; 
import Draggable from 'react-draggable';

const { jwtDecode } = require('jwt-decode');

const Page = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    
    if (token) {
      // Store token in localStorage
      localStorage.setItem('token', token);

      // Decode the token
      const decodedToken = jwtDecode(token);

      console.log("decide",decodedToken);
      
      localStorage.setItem('userId', decodedToken.id); // Match the field name in your token payload
         router.replace('/userHome');
    } else {
      console.error('No token found in URL');
    }
  }, [router]);

  useEffect(() => {
    const checkBlockStatus = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const decoded = jwtDecode(token);
        const userId = decoded.id; 
  
        const res = await fetch(`${process.env.NEXT_PUBLIC_Backend_Port}/getUser/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, 
          },
        });

        if (res.status === 403) {
          alert('Your account has been blocked. Please contact support.'); 
          localStorage.removeItem("token");
          localStorage.removeItem("userName");
          router.push('/signIn'); 
        }
      } catch (error) {
        console.error('Error checking block status:', error);
      }
    };

    checkBlockStatus();
  }, []);

  const toggleChat = () => {
    setChatOpen(prev => !prev);
  };

  return (
    <div className="relative">
      <ReduxProvider>
        <Navbar />
        <IndividualIntervalsExample /> 
        <OfferText />
        <Services />
        <TopRatedServices />
        <UserReviews />

        <Draggable>
          <button
            onClick={toggleChat}
            className="fixed bottom-4 right-4 bg-black text-yellow-400 px-4 py-2 rounded-md shadow-lg flex items-center hover:bg-gray-800 cursor-pointer"
            style={{ minWidth: '150px' }}
          >
            <AiOutlineUser size={20} className="mr-2" />
            Chat with Worker
          </button>
        </Draggable>
        {chatOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div 
              className="bg-gradient-to-b  rounded-xl shadow-2xl overflow-hidden" 
              style={{ width: '800px', height: '600px' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-xl">
                <h2 className="text-lg font-semibold">Chat with Worker</h2>
                <button onClick={toggleChat} className="text-white hover:text-gray-300">
                  <IoClose size={24} />
                </button>
              </div>

              {/* Chat Content */}
              <div className="p-4 h-full overflow-y-auto">
                <ChatApp />
              </div>
            </div>
          </div>
        )}

        <Footer />
      </ReduxProvider>
    </div>
  );
};

export default Page;
