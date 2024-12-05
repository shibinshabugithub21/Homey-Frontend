'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Wallet, User, CreditCard } from 'lucide-react';

const WalletCard = () => {
  const [worker, setWorker] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const workerId = localStorage.getItem('workerId');
    if (workerId) {
      const fetchWorker = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_Backend_Port}/worker/getWorker/${workerId}`
          );
          setWorker(response.data);
        } catch (error) {
          setError('Failed to fetch worker data.');
        } finally {
          setLoading(false);
        }
      };
      fetchWorker();
    } else {
      setError('No worker ID found in local storage.');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-md">
        <div className="animate-pulse flex space-x-4 items-center">
          <Wallet className="h-10 w-10 text-teal-500" />
          <span className="text-teal-500 font-medium">Loading Wallet...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-center flex items-center justify-center space-x-3">
        <CreditCard className="h-6 w-6" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white p-6 rounded-3xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-10"></div>

      {/* Card Header */}
      <div className="relative z-10 flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Wallet className="h-6 w-6" />
          <div className="text-lg font-bold">Worker Wallet</div>
        </div>
        <div className="text-sm font-semibold uppercase tracking-wide opacity-80">
          Debit Card
        </div>
      </div>

      {/* Card Details */}
      <div className="relative z-10 space-y-6">
        {/* Card Number with Masked Display */}
        <div className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-white/70" />
          <div className="text-xl tracking-wider font-semibold">
            **** **** **** {worker.walletId?.slice(-4) || '1234'}
          </div>
        </div>

        {/* Balance and User Info */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm uppercase tracking-wide opacity-70">Current Balance</p>
            <p className="text-4xl font-bold mt-1 flex items-center">
              ₹{worker.walletbalance?.toFixed(2) || '0.00'}
              <span className="ml-2 text-sm opacity-70 font-normal">INR</span>
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end space-x-2 mb-1">
              <User className="h-4 w-4 text-white/70" />
              <p className="text-sm uppercase tracking-wide opacity-70">Cardholder</p>
            </div>
            <p className="font-semibold text-lg">{worker.fullname}</p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/20"></div>
    </div>
  );
};

export default WalletCard;  