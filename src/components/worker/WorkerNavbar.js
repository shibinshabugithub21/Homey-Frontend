'use client';
import React, { useEffect, useState, useRef } from 'react';
import { FaBell, FaSun, FaMoon, FaUserCircle } from "react-icons/fa";
import useStore from "@/app/store/useStore";
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const WorkerNavbar = () => {
    const { isDarkMode, toggleDarkMode } = useStore();
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [worker, setWorker] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const profileRef = useRef(null);

    useEffect(() => {
        // Fetch worker details
        const workerId = localStorage.getItem('workerId');
        if (workerId) {
            const fetchWorker = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(
                        `${process.env.NEXT_PUBLIC_Backend_Port}/worker/getWorker/${workerId}`
                    );
                    setWorker(response.data);
                } catch (error) {
                    setError(
                        error.response?.data?.message || 'Failed to fetch worker data.'
                    );
                } finally {
                    setLoading(false);
                }
            };
            fetchWorker();
        } else {
            setError('No worker ID found in local storage.');
        }
    }, []);

    useEffect(() => {
        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleToggleDarkMode = () => toggleDarkMode();

    const handleNotificationClick = () => {
        if (notifications.length > 0) {
            Swal.fire({
                title: 'Booking Notifications',
                html: notifications.map((notification, index) => `
                    <div key="${index}">
                        <strong>User Name:</strong> ${notification.userName || 'N/A'}<br/>
                        <strong>Date:</strong> ${notification.date}<br/>
                        <strong>Location:</strong> ${notification.location || 'N/A'}<br/>
                        <strong>Issue:</strong> ${notification.issue || 'No issue described'}<br/><br/>
                    </div>
                `).join(''),
                icon: 'info',
                confirmButtonText: 'OK',
            });
        }
    };

    const toggleProfileDropdown = () => setIsProfileOpen((prev) => !prev);

    return (
        <>
            <nav className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
                <div className="flex items-center space-x-4">
                    <img src="/logo.png" alt="Logo" className="h-8" />
                    <h1 className={`text-xl ${isDarkMode ? 'text-white' : 'text-black'}`}>Worker Dashboard</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={handleToggleDarkMode} className={`flex items-center px-3 py-1 rounded ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                        {isDarkMode ? <FaSun className="mr-1" /> : <FaMoon className="mr-1" />}
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button onClick={handleNotificationClick} className="relative flex items-center">
                        <FaBell className={`text-xl ${isDarkMode ? 'text-white' : 'text-black'}`} />
                        {notificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                                {notificationCount}
                            </span>
                        )}
                    </button>
                    <div className="relative">
                        <button onClick={toggleProfileDropdown} className="relative flex items-center">
                            <FaUserCircle className={`text-xl ${isDarkMode ? 'text-white' : 'text-black'}`} />
                        </button>
                        {isProfileOpen && (
                            <div
                                ref={profileRef}
                                className={`absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'text-black'}`}
                            >
                                <div className="p-4">
                                    <h2 className="text-lg font-bold mb-2">Profile Management</h2>
                                    {loading ? (
                                        <p>Loading...</p>
                                    ) : error ? (
                                        <p className="text-red-500">{error}</p>
                                    ) : (
                                        <>
                                            <p><strong>Name:</strong> {worker?.fullname || 'N/A'}</p>
                                            <p><strong>Email:</strong> {worker?.email || 'N/A'}</p>
                                            <p><strong>Phone:</strong> {worker?.phone || 'N/A'}</p>
                                            <p><strong>Location:</strong> {worker?.location || 'N/A'}</p>
                                            <p><strong>Status:</strong> {worker?.availabilityStatus || 'N/A'}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            <ToastContainer />
        </>
    );
};

export default WorkerNavbar;
