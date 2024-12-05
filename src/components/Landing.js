import React from 'react'
import Navbar from './Navbar'
import IndividualIntervalsExample from './Carousel'
import OfferText from './offer'
import Services from './Services'
import TopRatedServices from './TopServices'
import UserReviews from './userReview'
import Footer from './footer'
const Landing = () => {
  return (
    <div className="relative">
    <Navbar/>
    <IndividualIntervalsExample/>
    <OfferText/>
    <Services/>
    <TopRatedServices/>
    <UserReviews/>
    <Footer/>
    </div>
  )
}

export default Landing
