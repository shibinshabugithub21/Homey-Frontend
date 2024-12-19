import React from 'react'
import AdminSideNavbar from '@/components/admin/AdminSideNavbar'
import AdminSubscriptionManagement from '@/components/admin/AdminPremium'
const page = () => {
  return (
    <div>
      <AdminSideNavbar/>
      <AdminSubscriptionManagement/>
    </div>
  )
}

export default page
