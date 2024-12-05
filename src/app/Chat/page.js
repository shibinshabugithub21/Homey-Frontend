import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/footer'
import ChatComponent from '@/components/Chatt/ChatCompoment'
const page = () => {
  return (
    <div>
      <Navbar/>
      <main className='mt-20'>
        <ChatComponent/>
      </main>
      <Footer/>
    </div>
  )
}

export default page
