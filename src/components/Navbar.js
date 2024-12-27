"use client";
import React, { useState, useEffect } from "react";
import useStore from "@/app/store/useStore";
import { useRouter } from "next/navigation";
import { User, CheckCircle } from "lucide-react";
import LocationModal from "./Location";

const Navbar = () => {
  const { searchQuery, setSearchQuery, isDarkMode, toggleDarkMode } = useStore();
  const [userName, setUserName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [premiumStatus, setPremiumStatus] = useState(null); // State for premium status
  const [userCoords, setUserCoords] = useState(null); // User's geolocation coordinates
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const authStatus = localStorage.getItem("isAuthenticated");
    if (name) {
      setUserName(name);
    }
    setIsAuthenticated(authStatus === "true");

    // Retrieve the selected location from localStorage
    const savedLocation = localStorage.getItem("selectedLocation");
    if (savedLocation) {
      setLocation(savedLocation);
    }

    // Retrieve the premium status from localStorage
    const savedPremiumStatus = localStorage.getItem("premiumStatus");
    if (savedPremiumStatus) {
      setPremiumStatus(JSON.parse(savedPremiumStatus));
    }

    // Get the user's current geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    localStorage.setItem("selectedLocation", selectedLocation);
    setModalOpen(false);
  };

  const filterNearbyServices = (services) => {
    if (!userCoords) return services;

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth's radius in km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in km
    };

    const maxDistance = 50; // Maximum distance in kilometers
    return services.filter((service) => {
      const distance = calculateDistance(
        userCoords.latitude,
        userCoords.longitude,
        service.latitude,
        service.longitude
      );
      return distance <= maxDistance;
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      localStorage.setItem("searchQuery", searchQuery);
      router.push(`/search`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="absolute top-4 left-2 right-0 bg-white shadow-md z-10 rounded-xl w-3/4 mx-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="font-bold text-2xl text-teal-600">
              <img src="/logo.png" alt="Homey" className="h-10" />
            </a>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center mx-4">
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded-l-lg py-2 px-4 w-64 focus:outline-none focus:ring focus:ring-teal-500"
              aria-label="Search services"
            />
            <button
              type="submit"
              className="bg-teal-600 text-white rounded-r-lg py-2 px-4 flex items-center"
              aria-label="Search"
            >
              Search
            </button>
          </form>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center">
            <a href="/userHome" className="mx-4 text-gray-700 hover:text-teal-600 font-semibold no-underline">
              Home
            </a>
            <a href="/servics" className="mx-4 text-gray-700 hover:text-teal-600 font-semibold no-underline">
              Services
            </a>
            <a
              href="/Booking/BookingHistory"
              className="mx-4 text-gray-700 hover:text-teal-600 font-semibold no-underline"
            >
              Booking
            </a>

            <a
              onClick={() => setModalOpen(true)} 
              className="flex items-center mx-4 text-gray-700 hover:text-teal-600 font-semibold no-underline cursor-pointer"
            >
              <i className="fas fa-map-marker-alt mr-1"></i>
              {/* Display the saved location */}
              {location && <span>{location}</span>}
            </a>

            <div
              className="text-gray-700 hover:text-teal-600 cursor-pointer font-semibold mx-4"
              onClick={toggleDarkMode}
            >
              <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            </div>
          </div>

          <div className="flex items-center">
            {userName ? (
              <a href="/profile" className="flex items-center text-teal-600 hover:text-teal-700 font-semibold no-underline mr-4">
                <User className="mr-2 text-gray-700" /> 
                <span>{userName}</span> 
                {premiumStatus && premiumStatus.isPremium && (
                  <CheckCircle className="ml-2 text-teal-600" size={20} />
                )}
              </a>
            ) : (
              <a  
                href="/signIn"
                className="bg-yellow-500 text-white px-4 py-2 rounded-full font-semibold no-underline hover:bg-yellow-400"
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Location Modal */}
      {modalOpen && <LocationModal closeModal={() => setModalOpen(false)} onLocationSelect={handleLocationSelect} />}
    </nav>
  );
};

export default Navbar;
