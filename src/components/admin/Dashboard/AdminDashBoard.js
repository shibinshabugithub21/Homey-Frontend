'use client'
import React from 'react';
import UserCount from './UserCount';
import WorkerCount from './WorkerCount';
import ServiceCount from './ServicesCount';
import LocationCount from './LocationCount';
import BookingCount from './BookingCount';
import LineChart from './LineChart';
import PieChart from './PieChart';
import BarChart from './BarChart';
import DoughnutChart from './Doughtnut';

const AdminDashBoard = () => {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-white text-center mb-8">
        Admin Dashboard
      </h1>
      
      {/* First Section with Counts */}
      <div className="flex flex-col items-center gap-6 border-2 border-white rounded-lg p-6 mb-8">
        <div className="flex flex-wrap gap-6 justify-between w-full">
          <div className="border border-blue-500 rounded-lg shadow-lg p-4 flex-1">
            <UserCount />
          </div>
          <div className="border border-blue-500 rounded-lg shadow-lg p-4 flex-1">
            <WorkerCount />
          </div>
          <div className="border border-blue-500 rounded-lg shadow-lg p-4 flex-1">
            <ServiceCount />
          </div>
          <div className="border border-blue-500 rounded-lg shadow-lg p-4 flex-1">
            <LocationCount />
          </div>
          <div className="border border-blue-500 rounded-lg shadow-lg p-4 flex-1">
            <BookingCount />
          </div>
        </div>
      </div>

      {/* Second Section with Square Graphs */}
      <div className="flex justify-between gap-6">
        <div className="w-[calc(50%-12px)] h-[300px] border border-blue-500 rounded-lg shadow-lg">
          <LineChart />
        </div>
        <div className="w-[calc(50%-12px)] h-[300px] border border-blue-500 rounded-lg shadow-lg">
          <PieChart />
        </div>
      </div>
      <div className="flex justify-between gap-6 mt-6">
        <div className="w-[calc(50%-12px)] h-[300px] border border-blue-500 rounded-lg shadow-lg">
          <DoughnutChart />
        </div>
        <div className="w-[calc(50%-12px)] h-[300px] border border-blue-500 rounded-lg shadow-lg">
          <BarChart />
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;

