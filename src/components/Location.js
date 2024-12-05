"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios"; // Import axios

const LocationModal = ({ closeModal, onLocationSelect }) => { // Added `onLocationSelect` prop
  const router = useRouter();

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch location data from the API using Axios
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true); // Set loading state to true when fetching
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/location`); // Use the appropriate API endpoint
        setLocations(response.data); // Set locations state with the response data
      } catch (error) {
        setError("Failed to load locations"); // Set error state if fetching fails
      } finally {
        setLoading(false); // Set loading state to false once the request completes
      }
    };

    fetchLocations();
  }, []);

  const handleLocationClick = (location) => {
    // Save location to localStorage
    localStorage.setItem('selectedLocation', location.name); // Store in localStorage

    // Pass the selected location back to the parent
    onLocationSelect(location.name); // Call the parent function to update location in the Navbar

    // Close the modal and navigate
    closeModal();
    router.push('/userHome');  // Optionally, navigate to a different page
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full">
          <h2 className="text-2xl font-bold mb-4">Loading Locations...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full">
          <h2 className="text-2xl font-bold mb-4">Error loading locations</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full">
        <h2 className="text-2xl font-bold mb-4">Choose Your Location</h2>
        <div className="grid grid-cols-4 gap-4">
          {locations.map((location, index) => (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer p-4 border rounded-lg hover:bg-teal-100"
              onClick={() => handleLocationClick(location)}
            >
              <img src={location.icon} alt={location.name} className="w-16 h-16 object-cover mb-2 rounded" />
              <span className="text-sm">{location.name}</span>
            </div>
          ))}
        </div>
        <button onClick={closeModal} className="mt-4 text-red-600 hover:text-red-800 font-semibold">
          Close
        </button>
      </div>
    </div>
  );
};

export default LocationModal;
