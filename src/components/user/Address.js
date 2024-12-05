"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

const ProfilePage = () => {
  const [addresses, setAddresses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    houseName: "",
    city: "",
    landmark: "",
    pincode: "",
    location: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    phone: "",
    houseName: "",
    city: "",
    pincode: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/getAddresses/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setAddresses(response.data.addresses);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError("Error fetching addresses");
      }
    };

    fetchAddresses();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validate the form fields
  const validateForm = () => {
    const errors = {};
    if (!form.name) errors.name = "Name is required";
    if (!form.phone) errors.phone = "Phone is required";
    if (!form.houseName) errors.houseName = "House name is required";
    if (!form.city) errors.city = "City is required";
    if (!form.pincode) errors.pincode = "Pincode is required";
    if (!form.location) errors.location = "Location is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add or update address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (validateForm()) {
      try {
        let response;
        if (editingIndex !== null) {
          const addressId = addresses[editingIndex]._id;
          response = await axios.put(
            `${process.env.NEXT_PUBLIC_Backend_Port}/editAddress/${localStorage.getItem("userId")}/${addressId}`,
            form,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const updatedAddresses = [...addresses];
          updatedAddresses[editingIndex] = response.data.address;
          setAddresses(updatedAddresses);
          setEditingIndex(null);
          setSuccess("Address updated successfully");
        } else {
          response = await axios.post(`${process.env.NEXT_PUBLIC_Backend_Port}/addAddress`, form, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAddresses([...addresses, response.data.newAddress]);
          setSuccess("Address added successfully");
        }

        setForm({
          name: "",
          phone: "",
          houseName: "",
          city: "",
          landmark: "",
          pincode: "",
          location: "",
        });
        setFormErrors({});
      } catch (error) {
        setError(error.response?.data?.message || "Error adding/updating address");
      }
    }
  };

  // Handle deleting an address
  const handleDeleteAddress = async (index) => {
    const token = localStorage.getItem("token");
    const addressId = addresses[index]._id;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_Backend_Port}/deleteAddress/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedAddresses = addresses.filter((_, i) => i !== index);
      setAddresses(updatedAddresses);
      setSuccess("Address deleted successfully");
    } catch (error) {
      setError("Error deleting address");
    }
  };

  // Handle editing an address
  const handleEditAddress = (index) => {
    setEditingIndex(index);
    setForm({
      name: addresses[index].name,
      phone: addresses[index].phone,
      houseName: addresses[index].houseName,
      city: addresses[index].city,
      landmark: addresses[index].landmark,
      pincode: addresses[index].pincode,
      location: addresses[index].location,
    });
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4">
        <Sidebar />
      </div>

      <div className="w-3/4 p-6">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        <div className=" p-6 rounded-lg shadow-lg border border-gray-300">
          <h3 className="text-2xl font-semibold mb-4">
            {editingIndex !== null ? "Edit Address" : "Add New Address"}
          </h3>
          <form onSubmit={handleAddAddress}>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-4 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-4 py-2 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">House Name</label>
                <input
                  type="text"
                  name="houseName"
                  value={form.houseName}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-4 py-2 border ${formErrors.houseName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {formErrors.houseName && <p className="text-red-500 text-sm">{formErrors.houseName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-4 py-2 border ${formErrors.city ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {formErrors.city && <p className="text-red-500 text-sm">{formErrors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Landmark</label>
                <input
                  type="text"
                  name="landmark"
                  value={form.landmark}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-4 py-2 border ${formErrors.pincode ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {formErrors.pincode && <p className="text-red-500 text-sm">{formErrors.pincode}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-4 py-2 border ${formErrors.location ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {formErrors.location && <p className="text-red-500 text-sm">{formErrors.location}</p>}
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              {editingIndex !== null ? "Update Address" : "Add Address"}
            </button>
          </form>
        </div>

        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addresses.map((address, index) => (
              <div key={index} className="p-4 border border-gray-280 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold">{address.name}</h4>
                <p className="text-gray-600">Phone: {address.phone}</p>
                <p className="text-gray-600">House: {address.houseName}</p>
                <p className="text-gray-600">City: {address.city}</p>
                <p className="text-gray-600">Landmark: {address.landmark}</p>
                <p className="text-gray-600">Pincode: {address.pincode}</p>
                <p className="text-gray-600">Location: {address.location}</p>
                <div className="flex mt-4 space-x-4">
                  <button
                    onClick={() => handleEditAddress(index)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(index)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;