"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstances";

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axiosInstance.get("/getPlans");
        setPlans(response.data.data);
        setLoading(false);
      } catch (error) {
        setError(error.message || "Failed to fetch plans");
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = (index) => {
    setSelectedPlan(index);
  };

  if (loading) return <div>Loading plans...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex h-screen">
     

      <div className="w-3/4 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Subscription Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                onClick={() => handleSelectPlan(index)}
                className={`cursor-pointer rounded-lg shadow-md p-6 ${
                  selectedPlan === index
                    ? "bg-purple-900 text-white"
                    : "bg-gray-50 text-gray-800"
                }`}
              >
                <h1 className="text-xl font-bold mb-2">{plan.type}</h1>

                {/* Horizontal line under the type */}
                <hr className="my-4 border-gray-300" />

                {/* Displaying the offer as bullet points */}
                <ul className="list-disc pl-6 mb-4">
                  {plan.offer.map((offerItem, index) => (
                    <li key={index} className="text-sm">
                      {offerItem}
                    </li>
                  ))}
                </ul>

                <p className="text-3xl font-bold mb-6">₹{plan.amount}</p>

                <ul className="space-y-2 mb-6">
                  {plan.features &&
                    plan.features.length > 0 &&
                    plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <svg
                          className={`w-5 h-5 mr-2 ${
                            selectedPlan === index ? "text-white" : "text-green-500"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                </ul>
                <button
                href="/Premium"
                  className={`py-2 px-4 rounded-lg w-full ${
                    selectedPlan === index ? "bg-white text-purple-900" : "bg-purple-900 text-white"
                  }`}
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
