import React from 'react'
import Navbar from '@/components/Navbar'
import BookingHistory from '@/components/user/BookingHistory'
import Footer from '@/components/footer'
const page = () => {
  return (
    <div>
      <Navbar/>
      <main className='mt-24'>
        <BookingHistory/>
      </main>
      <Footer/>
    </div>
  )
}

export default page
