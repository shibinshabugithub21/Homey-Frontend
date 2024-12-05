import React from 'react'
import AdminSideNavbar from '@/components/admin/AdminSideNavbar'
import ServiceManagement from '@/components/admin/AdminServices'
const page = () => {
  return (
    <div>
      <AdminSideNavbar/>
      <ServiceManagement/>
    </div>
  )
}

export default page
