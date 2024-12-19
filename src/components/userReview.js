'use client';
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstances'; // Adjust to your axios instance
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; // Swiper styles
import { Autoplay } from 'swiper/modules';

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);

  // Fetch all reviews when the component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Request all reviews from the backend
        const response = await axiosInstance.get('/getBookingDetails');
        console.log('Response:', response);
        
        if (response.data.success) {
          // Extract reviews from the response and set them to state
          const allReviews = response.data.booking.flatMap(booking => {
            // Include the user's name with the review if reviews exist
            return booking.review.map(r => ({
              ...r,
              name: booking.name,  // Add name to the review
            }));
          });
          setReviews(allReviews);  // Store all reviews in the state
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    // Trigger the fetching of reviews when the component mounts
    fetchReviews();
  }, []);

  return (
    <div className="max-w-3xl mx-auto text-center py-10">
      <h2 className="text-2xl font-bold mb-5">User Reviews</h2>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay]}
        className="mySwiper"
      >
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="p-5 bg-gray-100 border border-gray-300 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold">
                  {review.name}  {/* Displaying name from the booking object */}
                </h3>
                <p className="text-gray-600">{review.feedback}</p>
                <p className="mt-2 text-yellow-500">
                  {"⭐".repeat(review.rating)} {/* Displaying stars for the rating */}
                </p>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </Swiper>
    </div>
  );
};

export default UserReviews;
