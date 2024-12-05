'use client'
import React from 'react'
import Link from 'next/link'

const LandingNav = () => {
  return (
    <div>
      <nav className="bg-gray-800 p-4 text-white">
        <div className="container mx-auto flex justify-end items-center">
          <Link href="/worker/SignIn" className="text-white bg-blue-500 px-4 py-2 no-underline rounded-md">
            Employee Login
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default LandingNav
