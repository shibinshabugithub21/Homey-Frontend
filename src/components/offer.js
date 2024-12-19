
'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OfferText = () => {
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [services, setServices] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch offers
        const offersResponse = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/getOffers`);
        setOffers(offersResponse.data);

        // Fetch categories
        const categoriesResponse = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/getCategory`);
        setCategories(categoriesResponse.data);

        // Fetch services
        const servicesResponse = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/getServices`);
        setServices(servicesResponse.data);
      } catch (error) {
        console.error('Error fetching offers, categories, and services:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-yellow-400 text-black py-2 overflow-hidden">
      <div className="flex animate-marquee">
        {/* Map through the categories and display category offers */}
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <span key={index} className="mx-10">
              {category.offer}
            </span>
          ))
        ) : (
          <span className="mx-10">No categories available at the moment.</span>
        )}

        {/* Optionally, map through the offers directly */}
        {offers.length > 0 ? (
          offers.map((offer, index) => (
            <span key={index} className="mx-10">
              {offer.details}
            </span>
          ))
        ) : (
          <span className="mx-10">No offers available at the moment.</span>
        )}

        {/* Optionally display service names */}
        {services.length > 0 && (
          services.map((service, index) => (
            <span key={index} className="mx-10">
              {service.offer}
            </span>
          ))
        )}
      </div>
    </div>
  );
};

export default OfferText;
