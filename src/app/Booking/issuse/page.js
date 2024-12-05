import React from 'react'

import UserDetailsAndIssues from '@/components/user/UserDetailsAndIssues'
import Footer from '@/components/footer'
import Navbar from '@/components/Navbar'
const page = () => {
  return (
    <div>
      <Navbar/>
      <main className='mt-32'>
        <UserDetailsAndIssues/>
      </main>
      <Footer/>
    </div>
  )
}

export default page
