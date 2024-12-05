import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionHistory = () => {
  const [worker, setWorker] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const workerId = localStorage.getItem('workerId');
    if (workerId) {
      const fetchWorker = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/worker/getWorker/${workerId}`);
          setWorker(response.data); // Set fetched worker data
        } catch (error) {
          setError('Failed to fetch worker data.');
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchWorker();
    } else {
      setError('No worker ID found in local storage.');
      setIsLoading(false);
    }
  }, []);

  // Loading state
  if (isLoading) return <div>Loading...</div>;

  // Error handling
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // If worker is not found
  if (!worker) {
    return <div>No worker data found.</div>;
  }

  // If no transaction history is available
  if (!worker.wallethistory || worker.wallethistory.length === 0) {
    return <div>No transaction history available.</div>;
  }

  return (
    <div className="mt-8">
      <h1 className="text-lg font-semibold mb-4">Transaction History</h1>
      <div className="space-y-4">
        {worker.wallethistory.map((transaction, index) => (
          <div key={transaction._id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString()} {/* Format transaction date */}
              </span>
              <span className="text-sm text-green-500">
                +${transaction.amount.toFixed(2)} {/* Show amount */}
              </span>
            </div>
            <div className="mt-2 text-gray-700">{transaction.process}</div> {/* Show transaction process */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
