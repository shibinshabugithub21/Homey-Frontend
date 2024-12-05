import React from 'react';
import AddressManagement from '@/components/user/Address';

const Page = () => {
  return (
    <div className="flex-1 p-10 rounded-lg shadow-lg mx-6"> 
    <div className="grid grid-cols-1 gap-6"> 
      <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
        <AddressManagement />
      </div>
    </div>
    </div>
  );
};

export default Page;
