"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';

function DynamicCarousel() {
  const [banners, setBanners] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get('/api/getBanner'); 
        setBanners(response.data); 
        setLoading(false); 
      } catch (err) {
        console.error("Error fetching banners:", err);
        setError("Failed to load banners"); 
        setLoading(false);
      }
    };

    fetchBanners();
  }, []); // Empty dependency array means this runs once when the component mounts

  // Display loading or error state
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Carousel interval={2000} fade>
      {banners.map((banner, index) => (
        <Carousel.Item key={banner._id}> {/* Use unique banner ID as key */}
          <img
            className="w-full h-[600px] object-cover"
            src={banner.icon}  
            alt={`Slide ${index + 1}`}
          />
          <Carousel.Caption>
            <h3 className="text-black">{banner.title}</h3> {/* Assuming API provides title */}
            <p>{banner.description}</p> {/* Assuming API provides description */}
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default DynamicCarousel;
