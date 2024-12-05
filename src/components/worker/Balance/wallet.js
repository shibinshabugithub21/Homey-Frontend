'use client'
import React from 'react';
import Card from '@/components/worker/Balance/card';
import TransactionHistory from '@/components/worker/Balance/Transactio';

const WorkerWallet = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card />
      
      {/* Divider Line */}
      <div className="my-6 border-t border-gray-300"></div> 
      
      <TransactionHistory />
    </div>
  );
};

export default WorkerWallet;
