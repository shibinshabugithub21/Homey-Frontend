// components/AvailableWorkers.js
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AvailableWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [error, setError] = useState(null);
  const [loading,setLoading]=useState(true)
  const route = useRouter();

  useEffect(() => {
    const fetchAvailableWorkers = async () => {
      const storedLocation = localStorage.getItem("userLocation");
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/availableWorker?location=${location}`);
        if (response.data.length === 0) {
          console.log("No workers found for this location.");
        } else {
          setWorkers(response.data);
        }
      } catch (error) {
        console.error("Error fetching available workers:", error);
      }
    };

    fetchAvailableWorkers();
  }, []);

  const handleWorkerSelection = (worker) => {
    localStorage.setItem("selectedWorker", JSON.stringify(worker));
    route.push("/Booking/ConfirmServices");
  };



  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  return (
    <div>
      {workers.length > 0 ? (
        <div className="space-y-4">
          {workers.map((worker) => (
            <div key={worker._id} className="flex items-center justify-between p-4 border rounded shadow-md">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{worker.fullname}</h3>
                <p className="text-gray-700">Location: {worker.location}</p>
              </div>
              <button
                onClick={() => handleWorkerSelection(worker)} // Pass the whole worker object
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Select
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>loading</p>
        // <div className="absolute inset-0 flex items-center justify-center z-10 bg-transparent">
        //       <div className="w-16 h-16 border-4 border-t-transparent border-yellow-500 rounded-full animate-spin"></div>
        //        <p className="ml-4 text-lg font-semibold text-gray-700">Loading available workers...</p>
        //      </div>
      )}
    </div>
  );
};

export default AvailableWorkers;
