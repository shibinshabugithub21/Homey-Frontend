'use client'
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const ServiceBookingChart = () => {
  const [chartData, setChartData] = useState(null); // Default to null
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchMostBookedServices = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/getMostUsedServices`);
        const data = await response.json();
        
        if (data.services) {
          const services = data.services;
          const serviceNames = services.map(service => service.serviceName);
          const bookingCounts = services.map(service => service.bookingCount);

          setChartData({
            labels: serviceNames,
            datasets: [{
              label: 'Bookings by Service',
              data: bookingCounts,
              backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
              ],
              borderWidth: 1,
            }]
          });
        }
      } catch (error) {
        console.error('Error fetching the most booked services:', error);
      } finally {
        setIsLoading(false); // Set loading to false when the request completes
      }
    };

    fetchMostBookedServices();
  }, []);

  // Render loading spinner or chart based on the loading state
  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner
  }

  // Ensure chartData is defined before rendering the chart
  if (!chartData) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Most Booked Services</h2>
      <Doughnut data={chartData} />
    </div>
  );
};

export default ServiceBookingChart;
