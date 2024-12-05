import React from 'react'
import WorkerNavbar from '@/components/worker/WorkerNavbar'
import WorkerSidenav from '@/components/worker/WorkerSidenav';
import Services from '@/components/worker/services/servicesMangment'
import Footer from '@/components/footer'
const page = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
          {/* Navbar */}
          <WorkerNavbar />
    
          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            <div className="w-64 text-white shadow-xl">
              <WorkerSidenav />
            </div>
                <div className="flex-1 p-6 overflow-y-auto">
              <div className="">
                <Services/>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      );
}

export default page
