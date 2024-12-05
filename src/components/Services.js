'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const Services = () => {
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/getServices`); 

        if (response.data) {
          
          
          const activeServices = response.data.filter(service => !service.isBlocked);
          console.log('Active Services:', activeServices); 
          setServicesData(activeServices);
        } else {
          setError('No services found');
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-100">
        <div className="w-16 h-16 border-4 border-t-transparent border-green-500 rounded-full animate-spin"></div>
        <p className="ml-4 text-lg font-semibold text-gray-700">Loading available Services..</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border border-b rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-center text-teal-600 mb-8">Our Services</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 no-underline md:grid-cols-4 lg:grid-cols-6 gap-8 text-center">
          {servicesData.length > 0 ? (
            servicesData.map((service) => (
              <Link key={service._id} href={`/servics/${service._id}`}>
              <div
                key={service._id}
                className="flex flex-col items-center border border-b rounded-lg p-4"
                >
                <img 
                  src={service.icon} 
                  alt={service.name}
                  className="h-12 w-12 mb-4" 
                  />
                <h3 className="text-gray-800 no-underline font-semibold">{service.name}</h3>
              </div>
          </Link>
            ))
          ) : (
            <p className="text-gray-600">No services available</p>
          )}
        </div>
      </div>
    </section>
  );
  
};

export default Services;
