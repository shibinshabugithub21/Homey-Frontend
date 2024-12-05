"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import Pagination from "./pagination"; // Import your pagination component

const BookingManagementPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set how many bookings per page

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/booking`);
        if (response.status === 200 && Array.isArray(response.data.bookings)) {
          setBookings(response.data.bookings); // Access bookings directly from response.data
        } else {
          toast.error("Error fetching bookings: " + response.data.message);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error(
          "Error fetching data: " + (error.response ? error.response.data.message : error.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Pagination Logic
  const indexOfLastBooking = currentPage * itemsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - itemsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  return (
    <div className="flex h-screen bg-[#123] text-white">
      <main className="ml-64 p-8 w-full">
        <h1 className="text-4xl mb-6">Booking Management</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left border-collapse">
              <thead className="bg-teal-600">
                <tr>
                  <th className="p-4 border-b">Si.No</th>
                  <th className="p-4 border-b">Name</th>
                  <th className="p-4 border-b">Worker</th>
                  <th className="p-4 border-b">Location</th>
                  <th className="p-4 border-b">Service</th>
                  <th className="p-4 border-b">Status</th>
                  <th className="p-4 border-b">Date</th>
                  <th className="p-4 border-b">Payment</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((booking, index) => (
                  <tr key={booking._id} className="bg-[#234] hover:bg-teal-700">
                    <td className="p-4 border-b">{index + 1}</td>
                    <td className="p-4 border-b">{booking.name}</td>
                    <td className="p-4 border-b">{booking.workerId || "Not Assigned"}</td>
                    <td className="p-4 border-b">{booking.location}</td>
                    <td className="p-4 border-b">{booking.services}</td>
                    <td className="p-4 border-b">{booking.status}</td>
                    <td className="p-4 border-b">{new Date(booking.date).toLocaleDateString()}</td>
                    <td className="p-4 border-b">{booking.paymentStatus ? "Unpaid" : "Paid"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <Pagination
              totalItems={bookings.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage} // Handle page change
            />
          </div>
        )}
      </main>
      <ToastContainer />
    </div>
  );
};

export default BookingManagementPage;
