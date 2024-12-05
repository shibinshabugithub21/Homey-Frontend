import React from 'react';
import AdminSideNavbar from '@/components/admin/AdminSideNavbar';
import AdminDashBoard from '@/components/admin/Dashboard/AdminDashBoard';
const AdminSideHomePage = () => {
  return (
    <div className=" bg-[#123] text-white">
      <AdminSideNavbar />
      <main className="ml-64 p-8">
        <AdminDashBoard/>
      </main>
    </div>
  );
};

export default AdminSideHomePage;
