import React from 'react'
import Navbar from '@/components/Navbar'
import TopRatedServices from '@/components/TopServices'
import ServiceHeader from '@/components/user/servicesid'
import UserReviews from '@/components/userReview'
import Footer from '@/components/footer'
const page = () => {
  return (
    <div>
      <Navbar/>
      <main className='mt-24'>
        <ServiceHeader/>
        <TopRatedServices/>
        <UserReviews/>
        <Footer/>
      </main>
    </div>
  )
}

export default page
