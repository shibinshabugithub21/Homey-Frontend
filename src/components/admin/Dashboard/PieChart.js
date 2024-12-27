import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axiosInstance from '@/utils/axiosInstances';
import { Chart as ChartJS, Tooltip, Legend, ArcElement, Title } from 'chart.js';

ChartJS.register(Tooltip, Legend, ArcElement, Title);

const PieChart = () => {
  const [statusData, setStatusData] = useState({
    Completed: 0,
    Cancelled: 0,
    Pending: 0,
    'In-Progress': 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceStatusData = async () => {
      try {
        const response = await axiosInstance.get('/admin/services-status');
        setStatusData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };
    fetchServiceStatusData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const total = Object.values(statusData).reduce((acc, curr) => acc + curr, 0);
  const getPercentage = (value) => ((value / total) * 100).toFixed(1);

  const chartData = {
    labels: ['Completed', 'Cancelled', 'Pending', 'In-Progress'],
    datasets: [{
      data: [
        statusData.Completed,
        statusData.Cancelled,
        statusData.Pending,
        statusData['In-Progress']
      ],
      backgroundColor: [
        '#4CAF50',
        '#FF6347',
        '#FFD700',
        '#1E90FF'
      ],
      hoverBackgroundColor: [
        '#45a049',
        '#FF4500',
        '#FFC700',
        '#1873CC'
      ],
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => ({
                text: `${label} (${getPercentage(data.datasets[0].data[i])}%)`,
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: data.datasets[0].backgroundColor[i],
                lineWidth: 1,
                hidden: false,
                index: i
              }));
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage = getPercentage(value);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-64 max-w-3xl mx-auto p-4">
              <h3 className="text-xl font-bold mb-4 text-center">Booking Status Distribution</h3>

      <div className="h-full">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PieChart;