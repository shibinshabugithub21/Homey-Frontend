"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { MapPin } from "lucide-react";

const LocationModal = ({ closeModal, onLocationSelect }) => {
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/location`);
        setLocations(response.data);
      } catch (error) {
        setError("Failed to load locations");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const detectLocationFromIP = async () => {
    setIsLoadingCurrentLocation(true);
    try {
      const ipResponse = await axios.get("https://api.ipify.org?format=json");
      const ip = ipResponse.data.ip;
      const locationResponse = await axios.get(`https://ipapi.co/${ip}/json/`);
      const locationData = locationResponse.data;
      const detectedCity = locationData.city;

      if (detectedCity) {
        // Save the detected city to localStorage
        localStorage.setItem("selectedCity", detectedCity);
        onLocationSelect(detectedCity);
        closeModal();
        router.push("/userHome");
      } else {
        setError("Failed to detect your city. Please select manually.");
      }
    } catch (error) {
      setError("Failed to detect your location. Please select manually.");
    } finally {
      setIsLoadingCurrentLocation(false);
    }
  };

  const handleLocationClick = (location) => {
    // Save the selected location to localStorage
    localStorage.setItem("selectedCity", location.name);
    onLocationSelect(location.name);
    closeModal();
    router.push("/userHome");
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Choose Your Location</h2>
          <button 
            onClick={closeModal} 
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Auto-detect location button */}
        <div className="mb-6">
          <button
            onClick={detectLocationFromIP}
            disabled={isLoadingCurrentLocation}
            className="w-full flex items-center justify-center gap-2 p-3 border-2 border-teal-500 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
          >
            <MapPin className="w-5 h-5" />
            {isLoadingCurrentLocation ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Detecting location...
              </span>
            ) : (
              "Use Current Location"
            )}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {locations.map((location, index) => (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer p-4 border rounded-lg hover:bg-teal-100 transition-colors"
              onClick={() => handleLocationClick(location)}
            >
              <img 
                src={location.icon} 
                alt={location.name} 
                className="w-16 h-16 object-cover mb-2 rounded-lg shadow-sm" 
              />
              <span className="text-sm font-medium text-center">{location.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
