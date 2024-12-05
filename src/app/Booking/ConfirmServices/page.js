import React from 'react'
import Navbar from '@/components/Navbar'
import ConfirmService from '@/components/user/ConfirmServices'
import Footer from '@/components/footer'
const page = () => {
  return (
    <div>
        <Navbar/>
        <main className="mt-32 mb-20 px-6">
        <div className="max-w-4xl mx-auto">
            <ConfirmService/>
        </div>
      </main>
      <Footer/>
    </div>
  )
}

export default page
