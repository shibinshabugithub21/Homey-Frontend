import React from 'react'
import Navbar from '@/components/Navbar'
import Services from '@/components/Services'
import TopRatedServices from '@/components/TopServices'
import Footer from '@/components/footer'
import UserReviews from '@/components/userReview';

const page = () => {
  return (
    <div>
      <Navbar/>
      <main className='mt-16'>
      <Services/>
      <TopRatedServices/>
      <UserReviews/>
      </main>
    <Footer/>
    </div>
  )
}

export default page
