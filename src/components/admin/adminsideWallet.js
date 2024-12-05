'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  TrendingUp 
} from 'lucide-react';

const AdminSideWallet = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    paidBookings: 0,
    pendingBookings: 0
  });

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/booking`);
        if (response.status === 200 && Array.isArray(response.data.bookings)) {
          // Sort bookings in descending order (most recent first)
          const sortedBookings = response.data.bookings.sort((a, b) => 
            new Date(b.date) - new Date(a.date)
          );

          // Ensure accurate revenue calculation
          const totalRevenue = sortedBookings.reduce((sum, booking) => {
            // Ensure amount is a number and use 0 as fallback
            const bookingAmount = Number(booking.amount) || 0;
            return sum + bookingAmount;
          }, 0);

          setBookings(sortedBookings);

          // Calculate stats
          const totalBookings = sortedBookings.length;
          const paidBookings = sortedBookings.filter(booking => booking.paymentStatus === 'Paid').length;
          const pendingBookings = totalBookings - paidBookings;

          setStats({
            totalBookings,
            totalRevenue,
            paidBookings,
            pendingBookings
          });
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getPaymentStatusColor = (status) => {
    switch(status) {
      case 'Paid': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <RefreshCw className="h-12 w-12 text-teal-500 animate-spin" />
          <p className="mt-4 text-xl text-gray-600">Loading Bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        {/* Dashboard Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <TrendingUp className="mr-3 text-teal-600" />
            Admin Booking Dashboard
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-md flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalBookings}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Paid Bookings</p>
              <p className="text-2xl font-bold text-gray-800">{stats.paidBookings}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <XCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Bookings</p>
              <p className="text-2xl font-bold text-gray-800">{stats.pendingBookings}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">
                ₹{stats.totalRevenue.toLocaleString('en-IN', {
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Booking List */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Recent Bookings</h2>
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <div 
                key={index} 
                className="border-l-4 border-teal-500 bg-gray-50 p-4 rounded-r-lg hover:bg-gray-100 transition-all duration-300"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{booking.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{booking.services}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(booking.paymentStatus)}`}>
                      {booking.paymentStatus}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      ₹{Number(booking.amount).toLocaleString('en-IN', {
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(booking.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSideWallet;