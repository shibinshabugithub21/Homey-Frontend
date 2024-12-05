"use client"
import React from 'react'
import LandingNav from '@/components/worker/landingnav'
import WorkerSignUp from '@/components/worker/WorkerSignUp'
import Footer from '@/components/footer'
const page = () => {
  return (
    <div>
      <LandingNav/>
      <WorkerSignUp/>
      <Footer/>
    </div>
  )
}

export default page
