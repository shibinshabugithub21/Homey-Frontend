"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstances";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPhone, setUserPhone] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axiosInstance.get("/getPlans");
        setPlans(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message || "Failed to fetch plans.");
        setLoading(false);
      }
    };

    // Check if user is logged in
    const userDetails = localStorage.getItem("userDetails");
    if (userDetails) {
      setUserPhone(JSON.parse(userDetails).phone);
    } else {
      toast.error("User not logged in. Please log in first.");
      router.push("/login");
    }

    fetchPlans();
  }, []);

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

  const handlePayment = async (planId, amount) => {
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error("Invalid payment amount.");
      return;
    }

    try {
      // Fetch userId from localStorage
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("User not found. Please log in again.");
        return;
      }

      // Create Razorpay order on the backend (send amount in paise)
      const orderResponse = await axiosInstance.post("/create-order", { amount });
      const { id, currency } = orderResponse.data;

      await loadRazorpayScript();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Service Subscription",
        description: "Payment for subscription",
        order_id: id,
        handler: async (response) => {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

          // Send payment details to backend for verification
          const paymentResponse = await axiosInstance.post("/verifyPayment", {
            userId,
            premiumId: planId,
            amount,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
          });

          if (paymentResponse.data.message) {
            toast.success("Payment successful! Subscription activated.");
            localStorage.setItem("premiumStatus", JSON.stringify({
              isPremium: true,
              planId: planId,
            }));
            router.push("/userHome");
          }
        },
        prefill: {
          name: userId || "",
          email: userId || "",
          contact: userId || "",
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

  const handleSelectPlan = (index) => {
    setSelectedPlan(index);
    const selectedPlanId = plans[index]._id;
    localStorage.setItem("selectedPlanId", selectedPlanId);  
  };

  // Spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-900"></div>
    </div>
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="flex justify-center items-center h-screen">{error}</div>;

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-100">
        <Sidebar />
      </div>

      <div className="w-3/4 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Subscription Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                onClick={() => handleSelectPlan(index)}
                className={`cursor-pointer rounded-lg shadow-md p-6 ${selectedPlan === index ? "bg-purple-900 text-white" : "bg-gray-50 text-gray-800"}`}
              >
                <h1 className="text-xl font-bold mb-2">{plan.type}</h1>
                <hr className="my-4 border-gray-300" />
                <ul className="list-disc pl-6 mb-4">
                  {plan.offer.map((offerItem, i) => (
                    <li key={i} className="text-sm">{offerItem}</li>
                  ))}
                </ul>
                <p className="text-3xl font-bold mb-6">₹{plan.amount}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features && plan.features.length > 0 && plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg className={`w-5 h-5 mr-2 ${selectedPlan === index ? "text-white" : "text-green-500"}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePayment(plan._id, plan.amount)}
                  className={`py-2 px-4 rounded-lg w-full ${selectedPlan === index ? "bg-white text-purple-900" : "bg-purple-900 text-white"}`}
                >
                  {selectedPlan === index ? "Selected" : "Subscribe Now"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
