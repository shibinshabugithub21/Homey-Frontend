import React from 'react';
import UserCount from './UserCount';
import WorkerCount from './WorkerCount';
import ServiceCount from './ServicesCount';
import LocationCount from './LocationCount';
import BookingCount from './BookingCount';
import ServiceBookingChart from './ServiceBookingChart ';

const AdminDashBoard = () => {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-white text-center mb-8">
        Admin Dashboard
      </h1>
      <div className="flex flex-col items-start gap-6 border-2 border-white rounded-lg p-6">
        <div className="flex flex-wrap gap-6 w-full">
          <div className="border border-blue-500 rounded-lg shadow-lg p-4">
            <UserCount />
          </div>
          <div className="border border-blue-500 rounded-lg shadow-lg p-4">
            <WorkerCount />
          </div>
          <div className="border border-blue-500 rounded-lg shadow-lg p-4">
            <ServiceCount />
          </div>
          <div className="border border-blue-500 rounded-lg shadow-lg p-4">
            <LocationCount />
          </div>
          <div className="border border-blue-500 rounded-lg shadow-lg p-4">
            <BookingCount />
          </div>
        </div>
      </div>

      <ServiceBookingChart/>
    </div>
  );
};

export default AdminDashBoard;
