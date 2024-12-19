import React from "react";
import WorkerNavbar from "@/components/worker/WorkerNavbar";
import WorkerSidenav from "@/components/worker/WorkerSidenav";
import WorkerTable from "@/components/worker/status/workerStatus";
import Footer from "@/components/footer";

const page = () => {
  return (
    <div className="flex flex-col bg-gray-50">
      {/* Navbar */}
      <WorkerNavbar />

      {/* Main Content */}
      <div className="flex fl">
        <div className="w-64 text-white shadow-xl">
          <WorkerSidenav />
        </div>
        <div className="flex-1 p-6 ">
          {/* Worker Table */}
          <div>
            <WorkerTable />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default page;
