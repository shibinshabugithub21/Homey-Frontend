import React from 'react';
import WorkerNavbar from '@/components/worker/WorkerNavbar';
import WorkerSidenav from '@/components/worker/WorkerSidenav';
import ChatComponent from '@/components/worker/chat/chatComponent';
import Footer from '@/components/footer';

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <WorkerNavbar />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white shadow-xl">
          <WorkerSidenav />
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="">
            <ChatComponent />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Page;
