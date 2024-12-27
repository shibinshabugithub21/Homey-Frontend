import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axiosInstance from '@/utils/axiosInstances';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    // Fetch the revenue data using axiosInstance
    const fetchRevenueData = async () => {
      try {
        const response = await axiosInstance.get('/admin/revenue'); // Using the created Axios instance
        setRevenueData(response.data);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchRevenueData();
  }, []);

  // Prepare the chart data
  const chartData = {
    labels: revenueData.map((item) => item.month), // Use months from the fetched data
    datasets: [
      {
        label: 'Revenue',
        data: revenueData.map((item) => item.totalRevenue), // Use total revenue from the fetched data
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default LineChart;
