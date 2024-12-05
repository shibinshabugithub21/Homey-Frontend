"use client"

import React, { useState } from 'react';
import BannerDashboard from '@/components/admin/Banner/Banner';
import OfferManagement from '@/components/admin/Banner/Offer';
import AdminSideNavbar from '@/components/admin/AdminSideNavbar';

const Page = () => {
  // State to track the active tab (either 'banner' or 'offer')
  const [activeTab, setActiveTab] = useState('banner');

  return (
    <div className="flex min-h-screen">
      <AdminSideNavbar />

      <main className="flex-1 ml-64 p-6 bg-gray-100">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-6">
            {/* Banner Tab */}
            <button
              onClick={() => setActiveTab('banner')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'banner' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Banner Management
            </button>
            {/* Offer Tab */}
            <button
              onClick={() => setActiveTab('offer')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'offer' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Offer Management
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'banner' && <BannerDashboard />}
        {activeTab === 'offer' && <OfferManagement />}
      </main>
    </div>
  );
}

export default Page;
