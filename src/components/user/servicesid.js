"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

const ServiceHeader = () => {
  const router = useRouter();
  const { id } = useParams(); // Retrieve the ID from the URL
  const [service, setService] = useState(null); // Store the service details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedLocation, setSavedLocation] = useState(""); // State to store the saved location

  useEffect(() => {
    // Fetch service details
    const fetchService = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/getServices/${id}`);

        if (response.data) {
          console.log("serv", response.data);
          setService(response.data); // Set the service data
        } else {
          setError("Service not found");
        }
      } catch (error) {
        setError(error.message || "Failed to fetch service");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      // Only fetch if ID exists
      fetchService();
    }

    // Retrieve the saved location from localStorage
    const location = localStorage.getItem("selectedLocation");
    setSavedLocation(location || "No location selected");
  }, [id]);

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-100">
        <div className="w-16 h-16 border-4 border-t-transparent border-green-500 rounded-full animate-spin"></div>
        <p className="ml-4 text-lg font-semibold text-gray-700">Loading available services...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  const handleBookNow = () => {
    // Save service name in localStorage
    localStorage.setItem("selectedService", service.name);
    router.push(`/Booking`);
  };

  return (
    <div className="max-w-md mx-auto bg-white border rounded-lg shadow-md p-4 space-x-16">
      <div className="flex items-center space-x-10">
        <div className="flex-shrink-0">
          <img src={service.icon} alt={service.name || "Service"} className="h-12 w-12 mb-4" />
        </div>

        <div className="flex flex-col w-full">
          <div className="flex justify-between">
            <h1 className="text-lg font-bold">{service.name}</h1>
            <p className="text-sm font-medium text-gray-500">{service.offer || "No offer available"}</p>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <p className="flex items-center">
              Review:
              <span className="ml-1 text-yellow-500">{"★".repeat(service.rating || 0)}</span>
            </p>
            <p>Location: {savedLocation || "Not specified"}</p>
          </div>

          {/* Display the saved location */}
          {/* <div className="mt-2 text-sm text-gray-600">
            <strong>Saved Location:</strong> {savedLocation}
          </div> */}
        </div>

        <button
          onClick={handleBookNow}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default ServiceHeader;
