"use client";
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const SearchPage = ({ initialServices = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState(initialServices);

  useEffect(() => {
    const storedQuery = localStorage.getItem("searchQuery");
    if (storedQuery) {
      setSearchQuery(storedQuery);
    }
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const fetchServices = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/services?search=${searchQuery}`);
          setServices(response.data);
        } catch (error) {
          console.error("Error fetching services:", error);
        }
      };
      fetchServices();
    }
  }, [searchQuery]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-5xl p-6 bg-white shadow-lg rounded-lg">
        <div className="text-center flex flex-col items-center mb-8">
          <FaSearch className="text-teal-500 text-6xl mb-4" />
          <h1 className="text-4xl font-semibold text-teal-700">
            Search Results for: <span className="font-bold text-gray-800">{searchQuery}</span>
          </h1>
        </div>

        {services.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <li
                key={service._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
              >
                <img src={service.icon} alt="Service" className="h-16 w-16 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-center no-underline text-gray-800 mb-2">{service.name}</h2>
                <button className="w-full bg-teal-500 text-white py-2 rounded-lg no-underline  transition duration-200">
                  <a href={`/servics/${service._id}`} className="block w-full text-white no-underline text-center">
                    Learn More
                  </a>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600 mt-10 animate-bounce-fade">No services found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
