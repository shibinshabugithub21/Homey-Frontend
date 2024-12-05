// src/components/UserReviews.js
'use client'
import React, { createContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; // Update this line for Swiper v10 and above
import { Autoplay } from 'swiper/modules';

// Sample review data
const reviews = [
    {
        name: "John Doe",
        review: "This service was fantastic! Highly recommend.",
        rating: 5,
    },
    {
        name: "Jane Smith",
        review: "I had a great experience with the service provider.",
        rating: 4,
    },
    {
        name: "Alice Johnson",
        review: "Very satisfied with the quality of service.",
        rating: 5,
    },
    {
        name: "Bob Brown",
        review: "Good service, but there was a slight delay.",
        rating: 3,
    },
];

const UserReviews = () => {
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
                {reviews.map((review, index) => (
                    <SwiperSlide key={index}>
                        <div className="p-5 bg-gray-100 border border-gray-300 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold">{review.name}</h3>
                            <p className="text-gray-600">{review.review}</p>
                            <p className="mt-2">Rating: {'⭐'.repeat(review.rating)}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default UserReviews;
