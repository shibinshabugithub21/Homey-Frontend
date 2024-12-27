import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axiosInstance from "@/utils/axiosInstances";
import { X } from "lucide-react";

const SubscriptionPlansModal = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubscription, setShowSubscription] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axiosInstance.get("/getPlans");
        const fetchedPlans = Array.isArray(response?.data) ? response.data : [];
        setPlans(fetchedPlans);
        setLoading(false);
      } catch (error) {
        setError(error.message || "Failed to fetch plans.");
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setShowSubscription(true);
    }
  }, []);

  const handleSelectPlan = (index) => {
    setSelectedPlan(index);
  };

  const handleRedirectToPremium = (e) => {
    e.stopPropagation();
    router.push("/Premium");
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setShowSubscription(false);
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <div className="text-red-500 text-lg font-medium">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showSubscription && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full relative overflow-hidden"
            onClick={handleModalClick}
          >
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="relative pt-16 px-8 pb-8">
              <h2 className="text-3xl font-bold text-center mb-2">Choose Your Plan</h2>
              <p className="text-gray-500 text-center mb-8">Select the perfect plan for your needs</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map((plan, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPlan(index);
                    }}
                    className={`rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                      selectedPlan === index
                        ? 'ring-2 ring-purple-500 bg-purple-50'
                        : 'hover:shadow-lg border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{plan.type}</h3>
                      <span className="text-2xl font-bold text-purple-600">₹{plan.amount}</span>
                    </div>

                    <div className="space-y-4">
                      {plan.offer.map((offerItem, i) => (
                        <div key={i} className="flex items-start">
                          <svg
                            className="w-5 h-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-gray-600">{offerItem}</span>
                        </div>
                      ))}
                    </div>

                    {plan.features && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-4">Features included:</h4>
                        <ul className="space-y-3">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center text-gray-600">
                              <svg
                                className="w-4 h-4 text-green-500 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
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
                      </div>
                    )}

                    <button
                      onClick={handleRedirectToPremium}
                      className={`w-full mt-6 px-6 py-3 rounded-lg font-medium transition-colors ${
                        selectedPlan === index
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                      }`}
                    >
                      {selectedPlan === index ? 'Proceed with Plan' : 'Select Plan'}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default SubscriptionPlansModal;