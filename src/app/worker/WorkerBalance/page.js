import React from 'react'
import WorkerNavbar from '@/components/worker/WorkerNavbar'
import WorkerSidenav from '@/components/worker/WorkerSidenav'
import Wallet from '@/components/worker/Balance/wallet'
import Footer from '@/components/footer'

const page = () => {
  return (
    <div className="flex flex-col bg-gray-50 h-screen">
      {/* Navbar */}
      <WorkerNavbar />
    
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-32 text-white shadow-xl">
          <WorkerSidenav />
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Adjusted padding and margins */}
            <Wallet/>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default page
    