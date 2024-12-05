"use client";
import React, { useEffect, useState } from "react";
import useStore from "@/app/store/useStore";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { User } from "lucide-react"; 
import LocationModal from "./Location";

const Navbar = () => {
  const { searchQuery, setSearchQuery, isDarkMode, toggleDarkMode } = useStore();
  const [userName, setUserName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [location, setLocation] = useState(null);  // Store the selected location
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
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      localStorage.setItem("searchQuery", searchQuery);
      router.push(`/search`);
      setSearchQuery("");
    }
  };

  const getUserIdFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded ? decoded.userId : null;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const userId = getUserIdFromToken(token);
    console.log("userid", userId);
  }, [token]);

  // Function to handle location selection and update localStorage
  const handleLocationSelect = (newLocation) => {
    // Remove the existing location from localStorage if present
    localStorage.removeItem("selectedLocation");

    // Save the new location to localStorage
    localStorage.setItem("selectedLocation", newLocation);

    // Update the location state
    setLocation(newLocation);

    // Close the modal after selection
    setModalOpen(false);
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6h4m-2 2v12M4 10h4m-2 2v6M16 10h4m-2 2v6"
                />
              </svg>
            </button>
          </form>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center">
            <a href="/" className="mx-4 text-gray-700 hover:text-teal-600 font-semibold no-underline">
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

            <a
              href="/language"
              className="flex items-center mx-4 text-gray-700 hover:text-teal-600 font-semibold no-underline"
            >
              <i className="fas fa-language mr-1"></i>
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
                <User className="mr-2 text-gray-700" /> {/* Profile icon */}
                <span>{userName}</span> 
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

      {/* Location Modal with onLocationSelect function passed */}
      {modalOpen && <LocationModal closeModal={() => setModalOpen(false)} onLocationSelect={handleLocationSelect} />}
    </nav>
  );
};

export default Navbar;
