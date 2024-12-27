import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js";
import axiosInstance from "@/utils/axiosInstances";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const DoughnutChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
    }]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/admin/mostBookedServices");
        const services = response.data.sort((a, b) => b.count - a.count);
        
        setChartData({
          labels: services.map(service => service.name),
          datasets: [{
            data: services.map(service => service.count),
            backgroundColor: services.map((_, i) => 
              `hsl(${(i * 360) / services.length}, 70%, 60%)`
            ),
            borderWidth: 1,
            borderColor: 'white'
          }]
        });
      } catch (error) {
        console.error("Error fetching services data:", error);
      }
    };
    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { font: { size: 11 } }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            return `${context.label}: ${value} (${((value/total)*100).toFixed(1)}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Most Booked Services</h2>
      <div className="flex flex-col md:flex-row items-center gap-2">
        <div className="w-full h-[230px]">
          <Doughnut data={chartData} options={options} />
        </div>
        <div className="w-full md:w-1/4">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left p-1">Service</th>
                <th className="text-right p-1">Count</th>
              </tr>
            </thead>
            <tbody>
              {chartData.labels.map((label, index) => (
                <tr key={label} className="border-b">
                  <td className="p-1">{label}</td>
                  <td className="text-right p-1">{chartData.datasets[0].data[index]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoughnutChart;