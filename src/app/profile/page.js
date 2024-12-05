'use client';
import React from 'react';
import Sidebar from '@/components/user/Sidebar';
import ProfileDetails from '@/components/user/ProfileDetails';

const Page = () => {
  return (
    <div>
      {/* Main Content */}
      <div className="flex-1 p-10 rounded-lg shadow-lg mx-6"> {/* Adjusted width and padding */}
        <div className="grid grid-cols-1 gap-6"> {/* Added grid with spacing */}
          <div className="p-6 bg-gray-50 rounded-lg shadow-sm"> {/* Added background and padding */}
            <ProfileDetails />
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default Page;
