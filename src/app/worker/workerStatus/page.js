import React from "react";
import WorkerNavbar from "@/components/worker/WorkerNavbar";
import WorkerSidenav from "@/components/worker/WorkerSidenav";
import LeaveSetup from "@/components/worker/status/leave";
import WorkerTable from "@/components/worker/status/workerStatus";
import Footer from "@/components/footer";

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
          {/* Worker Table */}
          <div>
            <WorkerTable />
          </div>

          {/* Separator Line */}
          <div className="my-6 border-t border-gray-300"></div>

          {/* Leave Setup */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Leave Management
            </h2>
            <LeaveSetup />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default page;
