'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OfferText = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    // Fetch the offers when the component mounts
    const fetchOffers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/getOffers`);
        setOffers(response.data);
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };

    fetchOffers();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="bg-yellow-400 text-black py-2 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Map through the offers and display them */}
        {offers.length > 0 ? (
          offers.map((offer, index) => (
            <span key={index} className="mx-10">
              {offer.details}
            </span>
          ))
        ) : (
          <span className="mx-10">No offers available at the moment.</span>
        )}
      </div>
    </div>
  );
};

export default OfferText;
