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
  const [modalOpen, setModalOpen] = useState(false); // For controlling modal
  const [selectedBooking, setSelectedBooking] = useState(null); // To store the selected booking for feedback
  const [rating, setRating] = useState(0); // Rating state
  const [feedback, setFeedback] = useState(""); // Feedback text

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

  const handleFeedbackSubmit = async () => {
    if (rating === 0 || !feedback) {
      toast.error("Please provide a rating and feedback.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_Backend_Port}/submitFeedback`, {
        bookingId: selectedBooking._id,
        rating,
        feedback,
      });

      if (response.data.success) {
        toast.success("Feedback submitted successfully.");
        setModalOpen(false); // Close the modal after feedback submission
        setRating(0); // Reset rating
        setFeedback(""); // Reset feedback
      } else {
        toast.error("Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Error submitting feedback.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-100 rounded-lg shadow-lg relative">
      {isLoading && (
        <div className="absolute inset-0 bg-opacity-60 z-10 flex items-center justify-center transition-opacity duration-300 ease-out">
          <div className="w-16 h-16 border-4 border-t-transparent border-green-600 rounded-full animate-spin">Loading</div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Booking History</h2>
      {bookingHistory.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No bookings found.</p>
      ) : (
        <ul className="space-y-6">
          {bookingHistory.map((booking) => (
            <li key={booking._id} className="bg-white p-5 rounded-lg shadow-md transition-transform hover:scale-105 flex justify-between items-center">
              {/* Left side (Booking details) */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-indigo-600">{booking.services}</h3>
                <p><strong>Worker Name:</strong> {booking.workerId?.fullname}</p>
                <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                <p><strong>Location:</strong> {booking.location}</p>
                <p><strong>Address:</strong> {booking.address}</p>
                <p><strong>Description:</strong> {booking.description}</p>
                <p><strong>Service Fee:</strong> {booking.serviceFee ? `₹${booking.serviceFee}` : "Not set"}</p>
                {/* Show the review if available */}
                {booking.review && booking.review.length > 0 && (
                <div className="mt-2">
                  <strong>Feedback:</strong>
                  <div className="flex items-center">
                    <span className="text-yellow-500">
                      {"★".repeat(booking.review[booking.review.length - 1].rating)}
                    </span>
                    <p className="ml-2 text-gray-600">{booking.review[booking.review.length - 1].feedback}</p>
                  </div>
                </div>
              )}
              </div>

              {/* Right side (Rating and Feedback button) */}
              <div className="ml-6 flex flex-col items-center">
                {booking.paymentStatus === "Paid" ? (
                  <>
                    <p className="text-green-500 font-semibold mt-2">Payment Successful!</p>
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setModalOpen(true); // Open feedback modal
                      }}
                      className="mt-4 text-blue-500"
                    >
                      Leave Feedback
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handlePayment(booking._id, booking.serviceFee)}
                    className="mt-4 bg-teal-500 text-white px-5 py-3 rounded-lg hover:bg-teal-600 transition-colors duration-300 ease-in-out"
                  >
                    Confirm & Pay ₹{booking.serviceFee} for Service
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Feedback Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Leave Feedback</h3>
            <div className="flex items-center mb-4">
              <span className="mr-2">Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer ${rating >= star ? "text-yellow-500" : "text-gray-400"}`}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="4"
              className="w-full border p-2 rounded-md mb-4"
              placeholder="Your feedback..."
            ></textarea>
            <button
              onClick={handleFeedbackSubmit}
              className="bg-teal-500 text-white px-5 py-3 rounded-lg hover:bg-teal-600 transition-colors duration-300 ease-in-out"
            >
              Submit Feedback
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 text-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
