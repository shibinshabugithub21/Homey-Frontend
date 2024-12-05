import React from 'react'
import Navbar from '@/components/Navbar'
import Calender from'@/components/user/calender'
import Footer from '@/components/footer'
const page = () => {
  return (
    <div>
        <Navbar/>
        <main className="mt-32 mb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Calender />
        </div>
      </main>
      <Footer/>
    </div>
  )
}

export default page
