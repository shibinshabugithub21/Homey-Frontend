'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserDetailsAndIssues = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [nameError, setNameError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [addressError, setAddressError] = useState(null);
  const [serviceError, setServiceError] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);

  useEffect(() => {
    const storedService = localStorage.getItem("selectedService");
    const location = localStorage.getItem("selectedLocation");
    if (storedService) {
      setService(storedService);
    }
    if(location) setLocation(location)
  }, []);

  const validateFields = () => {
    let valid = true;

    if (!name.trim()) {
      setNameError("Please enter your name.");
      valid = false;
    } else {
      setNameError(null);
    }

    if (!/^[\d]{10}$/.test(phone)) {
      setPhoneError("Please enter a valid 10-digit phone number.");
      valid = false;
    } else {
      setPhoneError(null);
    }

    if (!location.trim()) {
      setLocationError("Please enter a valid location.");
      valid = false;
    } else {
      setLocationError(null);
    }

    if (!address.trim()) {
      setAddressError("Please enter your address.");
      valid = false;
    } else {
      setAddressError(null);
    }

    if (!service.trim()) {
      setServiceError("Please enter the type of service required.");
      valid = false;
    } else {
      setServiceError(null);
    }

    if (!description.trim()) {
      setDescriptionError("Please describe your issue.");
      valid = false;
    } else {
      setDescriptionError(null);
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    const date = localStorage.getItem("selectedDate");
    const userId = localStorage.getItem("userId");
    const bookingData = {
      name,
      phone,
      location,
      service,
      description,
      date,
      address,
      userId,
    };

    localStorage.setItem("userDetails", JSON.stringify(bookingData));

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_Backend_Port}/book-service`, bookingData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        const bookingId = response.data.booking._id;
        localStorage.setItem("bookingId", bookingId);
        const workersResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_Backend_Port}/availableWorker?location=${location}&services=${service}`
        );
        const workers = workersResponse.data;

        if (workers.length > 0) {
          window.location.href = `/Booking/workerList?bookingId=${bookingId}&location=${location}&services=${service}`;
        } else {
          toast.error("No workers available for the selected location and service.");
        }
      }
    } catch (error) {
      console.error("Error booking the service:", error);
      toast.error("No workers available for the selected location and service.");

    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">User Details and Issues</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full"
          />
          {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
        </div>

        <div className="mb-4">
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 rounded w-full"
          />
          {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Location"
            value={location}
            readOnly
            onChange={(e) => setLocation(e.target.value)}
            className="border p-2 rounded w-full"
          />
          {locationError && <p className="text-red-500 text-sm mt-1">{locationError}</p>}
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border p-2 rounded w-full"
          />
          {addressError && <p className="text-red-500 text-sm mt-1">{addressError}</p>}
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Type of Service Required"
            value={service}
            readOnly
            onChange={(e) => setService(e.target.value)}
            className="border p-2 rounded w-full"
          />
          {serviceError && <p className="text-red-500 text-sm mt-1">{serviceError}</p>}
        </div>

        <div className="mb-4">
          <textarea
            placeholder="Describe your issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded w-full"
          />
          {descriptionError && <p className="text-red-500 text-sm mt-1">{descriptionError}</p>}
        </div>

        <button type="submit" className="bg-blue-500 text-white rounded-lg py-2 w-full hover:bg-blue-600 transition">
          Submit
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UserDetailsAndIssues;
