'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkerTable = () => {
  const [worker, setWorker] = useState(null); 
  const [error, setError] = useState(null); 
  const [status, setStatus] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); 

  useEffect(() => {
    const workerId = localStorage.getItem('workerId'); 
    if (workerId) {
      const fetchWorker = async () => {
        setLoading(true); // Show loading
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_Backend_Port}/worker/getWorker/${workerId}`
          );
          setWorker(response.data);
          setStatus(response.data.availabilityStatus); // Set the current status
        } catch (error) {
          setError(
            error.response?.data?.message || 'Failed to fetch worker data.'
          );
        } finally {
          setLoading(false); // Hide loading
        }
      };
      fetchWorker();
    } else {
      setError('No worker ID found in local storage.');
    }
  }, []);

  // Update availability status
  const updateAvailability = async (newStatus) => {
    const workerId = localStorage.getItem('workerId');
    if (!workerId) return;

    setUpdating(true); // Start updating animation
    setSuccessMessage(''); // Clear previous messages
    setError(null); // Clear previous errors

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_Backend_Port}/worker/updateWorker/${workerId}`, {
        availabilityStatus: newStatus,
      });
      setStatus(newStatus); // Update local state
      setSuccessMessage('Availability status updated successfully!');
    } catch (error) {
      setError(
        error.response?.data?.message || 'Failed to update availability status.'
      );
    } finally {
      setUpdating(false); // Stop updating animation
    }
  };

  // Full-page loading indicator
  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
        <div className="relative flex items-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
          <img
            src="/logo.png"
            alt="Logo"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10"
          />
        </div>
        <p className="ml-4 text-lg font-semibold text-indigo-700">Loading worker data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Worker Availability Management</h1>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {worker ? (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border shadow-md rounded-md mb-4">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Worker ID</th>
                <th className="border border-gray-300 px-4 py-2">Worker Name</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Department</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Phone</th>
                <th className="border border-gray-300 px-4 py-2">Location</th>
                <th className="border border-gray-300 px-4 py-2">Date of Hire</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">{worker?._id || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{worker?.fullname || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{worker?.email || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{worker?.employment?.department || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{status || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{worker?.phone || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{worker?.location || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {worker?.employment?.dateOfHire
                    ? new Date(worker.employment.dateOfHire).toLocaleDateString()
                    : 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mb-4">
            <label htmlFor="availability" className="block font-medium mb-2">
              Update Availability Status:
            </label>
            <select
              id="availability"
              value={status}
              onChange={(e) => updateAvailability(e.target.value)}
              className="border border-gray-300 p-2 rounded-md"
              disabled={updating}
            >
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
              <option value="Busy">Busy</option>
              <option value="Do Not Disturb">Do Not Disturb</option>
            </select>
            {updating && (
              <div className="mt-2 flex items-center text-gray-500">
                <div className="loader border-t-4 border-indigo-500 rounded-full w-6 h-6 animate-spin"></div>
                <p className="ml-2">Updating status...</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No worker data available.</p>
      )}
    </div>
  );
};

export default WorkerTable;
