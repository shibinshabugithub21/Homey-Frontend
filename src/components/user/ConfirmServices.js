
'use client';
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstances'; 
import { useRouter } from 'next/navigation';

const ConfirmService = () => {
    const router = useRouter();
    const [userData, setUserData] = useState({});
    const [workerData, setWorkerData] = useState({});
    const initialAmount = 30;
    const userId=localStorage.getItem('userId')
    const bookingId=localStorage.getItem('bookingId')

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('userDetails'));
        const storedWorker = JSON.parse(localStorage.getItem('selectedWorker'));

        if (storedUser) setUserData(storedUser);
        if (storedWorker) setWorkerData(storedWorker);
    }, []);

    const loadRazorpayScript = () => {
        return new Promise((resolve, reject) => {
            const existingScript = document.getElementById('razorpay-sdk');
            if (!existingScript) {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.id = 'razorpay-sdk';
                script.onload = () => resolve();
                script.onerror = () => reject(new Error('Razorpay SDK failed to load'));
                document.body.appendChild(script);
            } else {
                resolve();
            }
        });
    };

    const createChatAndSaveMessage = async (userId, workerId) => {
        console.log("Sender:", userId, "Receiver:", workerId);
        
        try {
            const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_Backend_Port}/worker/createChat`, {
                userId,
                workerId
            });
            
            console.log('Full API Response:', response.data);
    
            // Ensure the response structure matches what you expect
            if (response.data && response.data.chat && response.data.chat._id) {
                const chatId = response.data.chat._id;
                console.log('Chat ID:', chatId);
                
                // Save to localStorage
                localStorage.setItem('ChatId', chatId);
                console.log('ChatId saved to localStorage:', localStorage.getItem('ChatId'));                
                if (response.data.success) {
                    console.log('Chat created and message saved:', response.data.chat);
                    return response.data.chat;
                } else {
                    console.error('Failed to create chat or save message:', response.data.message);
                    return null;
                }
            } else {
                console.error('Chat ID is missing in the response:', response.data);
                return null;
            }
        } catch (error) {
            console.error('Error creating chat and saving message:', error);
            return null;
        }
    };
    
    
// add the chat id  messgedb 

    const handleBookService = async () => {
        const storedUser = JSON.parse(localStorage.getItem('userDetails'));
        const bookingData = {
            workerId: workerData._id,
            name: storedUser.name || '',
            location: storedUser.location || '',
            phone: storedUser.phone || '',
            description: storedUser.description || '',
            date: new Date().toISOString(),
            amount: initialAmount,
            userId,
            address:storedUser.address,
            services:storedUser.service,
            bookingId
        };
      
        
    
        if (!bookingData.name || !bookingData.phone || !bookingData.description || !bookingData.date || !bookingData.workerId) {
            alert('Please fill in all required fields.');
            return;
        }
        
        try {
            const chat = await createChatAndSaveMessage(userId, workerData._id);

        if (!chat) {
            alert('Failed to create chat. Please try again.');
            return;
        }

        const chatId = chat._id;
            const orderResponse = await axiosInstance.post('/create-order', { amount: initialAmount });
            const { id, currency, amount } = orderResponse.data;
            await loadRazorpayScript();
    
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: amount,
                currency: currency,
                name: 'Service Booking',
                description: 'Booking Payment',
                order_id: id,
                handler: async (response) => {
                    console.log('Payment successful:', response);
                    try {
                        const bookingSaveResponse = await axiosInstance.post('/book-service', {...bookingData,chatId:chatId});
                        if (bookingSaveResponse.data.success) {
                            alert('Booking confirmed and saved!');
                            localStorage.removeItem('bookingId');
                            const message = 'Booking confirmed with worker. Lets start chatting!';
                            console.log("sender",userId);
                            
                            if (chat) {
                                router.push('/userHome');
                            } else {
                            }
                        } else {
                            console.error('Failed to save booking:', bookingSaveResponse.data.message);
                            alert('Booking confirmed, but failed to save details.');
                        }
                    } catch (saveError) {
                        console.error('Error saving booking:', saveError);
                        alert('Booking confirmed, but failed to save details.');
                    }
                },
                prefill: {
                    name: userData.name || '',
                    email: userData.email || '',
                    contact: userData.phone || '',
                },
                theme: {
                    color: '#F37254',
                },
            };
    
            if (window.Razorpay) {
                const razorpay = new window.Razorpay(options);
                razorpay.open();
            } else {
                throw new Error('Razorpay SDK not available');
            }
        } catch (error) {
            console.error('Error booking service:', error);
            alert('Failed to book service.');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-gray-100 rounded-lg shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-center mb-4">Confirm Your Booking Details</h2>
            
            {/* User Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold border-b pb-2 mb-4 text-blue-600">User Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <p><span className="font-semibold">Name:</span> {userData.name || 'N/A'}</p>
                    <p><span className="font-semibold">Address:</span> {userData.address}</p>
                    <p><span className="font-semibold">Phone:</span> {userData.phone || 'N/A'}</p>
                    <p><span className="font-semibold">Location:</span> {userData.location || 'N/A'}</p>
                </div>
            </div>

            {/* Worker Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold border-b pb-2 mb-4 text-green-600">Worker Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <p><span className="font-semibold">Name:</span> {workerData?.fullname || 'N/A'}</p>
                    <p><span className="font-semibold">Location:</span> {workerData?.location || 'N/A'}</p>
                    <p><span className="font-semibold">Phone:</span> {workerData?.phone || 'N/A'}</p>
                    <p><span className="font-semibold">Department:</span> {workerData?.employment?.department || 'N/A'}</p>
                </div>
            </div>

            {/* Service Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold border-b pb-2 mb-4 text-purple-600">Service Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <p><span className="font-semibold">Service Name:</span> {userData.service || 'N/A'}</p>
                    <p><span className="font-semibold">Description:</span> {userData.description || 'N/A'}</p>
                    <p><span className="font-semibold">Booking Fee:</span> ₹{initialAmount}</p> 
                </div>
            </div>
            <button 
                onClick={handleBookService}
                className="bg-blue-500 text-white font-semibold rounded-lg py-3 w-full hover:bg-blue-600 transition"
            >
                Confirm & Pay ₹{initialAmount} for Service
            </button>
        </div>
    );
};

export default ConfirmService;
