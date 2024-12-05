'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"; 

const BookingHistory = () => {
  const router = useRouter();
  const [bookingHistory, setBookingHistory] = useState([]);
  const [userPhone, setUserPhone] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userDetails = localStorage.getItem("userDetails");
      if (userDetails) {
        setUserPhone(JSON.parse(userDetails).phone);
      } else {
        toast.error("User not logged in. Please log in first.");
        router.push("/login"); 
      }
    }
  }, []);

  useEffect(() => {
    if (userPhone) {
      const fetchBookingHistory = async () => {
        try {
          setIsLoading(true); // Start loading
          const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/user-booking-history?phone=${userPhone}`);
          setBookingHistory(response.data);
        } catch (error) {
          console.error("Error fetching booking history:", error);
        } finally {
          setIsLoading(false); // End loading
        }
      };

      fetchBookingHistory();
    }
  }, [userPhone]);

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const existingScript = document.getElementById("razorpay-sdk");
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.id = "razorpay-sdk";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
        document.body.appendChild(script);
      } else {
        resolve();
      }
    });
  };

  const handlePayment = async (bookingId, amount) => {
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error("Invalid payment amount.");
      return;
    }

    try {
      // Create Razorpay order
      const orderResponse = await axios.post(`${process.env.NEXT_PUBLIC_Backend_Port}/create-order`, { amount });
      const { id, currency, amount: serviceFee } = orderResponse.data;

      await loadRazorpayScript();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: serviceFee,
        currency,
        name: "Service Booking",
        description: "Payment for service",
        order_id: id,
        handler: async (response) => {
          try {
            const { paymentId, orderId, signature } = response;
            const bookingSaveResponse = await axios.post(`${process.env.NEXT_PUBLIC_Backend_Port}/worker-payment`, {
              bookingId,
              paymentDetails: { paymentId, orderId, signature },
            });

            if (bookingSaveResponse.data.success) {
              toast.success("Payment successful!");
              router.push("/userHome");
            } else {
              toast.error("Payment processed, but worker wallet not credited.");
            }
          } catch (err) {
            console.error("Error saving payment:", err);
            toast.error("Payment processed, but an error occurred during confirmation.");
          }
        },
        prefill: {
          name: userPhone || "",
          email: userPhone || "",
          contact: userPhone || "",
        },
        theme: {
          color: "#F37254",
        },
      };

      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        throw new Error("Razorpay SDK not available");
      }
    } catch (error) {
      console.error("Payment initialization failed:", error);
      toast.error("Failed to initialize payment.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-100 rounded-lg shadow-lg relative">
      {isLoading && (
         <div className="absolute inset-0  bg-opacity-60 z-10 flex items-center justify-center transition-opacity duration-300 ease-out">
         <div className="w-16 h-16 border-4 border-t-transparent border-green-600 rounded-full animate-spin">Loading</div>
       </div>
      )}

      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Booking History</h2>
      {bookingHistory.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No bookings found.</p>
      ) : (
<ul className="space-y-6">
  {bookingHistory.map((booking) => (
    <li key={booking._id} className="bg-white p-5 rounded-lg shadow-md transition-transform hover:scale-105">
      <h3 className="text-xl font-semibold text-indigo-600">{booking.services}</h3>
      {/* Render the worker's full name */}
      <p><strong>Worker Name:</strong> {booking.workerId?.fullname}</p>
      <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
      <p><strong>Location:</strong> {booking.location}</p>
      <p><strong>Address:</strong> {booking.address}</p>
      <p><strong>Description:</strong> {booking.description}</p>
      <p><strong>Service Fee:</strong> {booking.serviceFee ? `₹${booking.serviceFee}` : "Not set"}</p>
      {booking.paymentStatus !== "Paid" ? (
        <button
          onClick={() => handlePayment(booking._id, booking.serviceFee)}
          className="mt-4 bg-teal-500 text-white px-5 py-3 rounded-lg hover:bg-teal-600 transition-colors duration-300 ease-in-out"
        >
          Confirm & Pay ₹{booking.serviceFee} for Service
        </button>
      ) : (
        <p className="text-green-500 font-semibold mt-2">Payment Successful!</p>
      )}
    </li>
  ))}
</ul>
      )}
    </div>
  );
};

export default BookingHistory;
