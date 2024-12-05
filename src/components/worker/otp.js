'use client';

import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'; 

const otp = ({ contactInfo, contactType }) => {
    const [otp, setOtp] = useState(new Array(6).fill("")); 
    const [timer, setTimer] = useState(60); 
    const [resendActive, setResendActive] = useState(false); 
    const router = useRouter(); 
    
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(prevTime => prevTime - 1);
            }, 1000);
        } else {
            setResendActive(true); 
        }
        return () => clearInterval(interval); 
    }, [timer]);

    // Handle OTP input change
    const handleChange = (index, e) => {
        const value = e.target.value;
        if (/^[0-9]$/.test(value)) { 
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (index < 5) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }
        } else if (value === "") { 
            if (index > 0) {
                document.getElementById(`otp-input-${index - 1}`).focus();
            }
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join(''); 
        const token = sessionStorage.getItem('authToken'); 
        if (!otpCode || otpCode.length < 6) {
            toast.error('Please enter a valid OTP before submitting.');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_Backend_Port}/worker/WorkerVerify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ otp: otpCode }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('OTP verified successfully!');
                router.push('/worker/registration'); 
            } else {
                toast.error(data.message || 'Invalid OTP. Please try again or request a new OTP.');
            }
        } catch (error) {
            console.error('Error during OTP verification:', error);
            toast.error('An error occurred while verifying OTP. Please check your network.');
        }
    };
    useEffect(()=>{
        const token = localStorage.getItem('token')
        console.log('access Token',token);
        if(token){
          router.push('/worker/homepage')
        }
      },[])

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                    <h3 className="text-lg font-semibold mb-2">
                        Enter the OTP sent to your {contactType}:
                    </h3>
                    <div className="flex justify-between mb-6">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={data}
                                onChange={(e) => handleChange(index, e)}
                                className="w-10 h-10 text-center border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id={`otp-input-${index}`}
                                inputMode="numeric"
                            />
                        ))}
                    </div>
                    <button type='submit' className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors mb-4">
                        Verify OTP
                    </button>
                    {timer > 0 ? (
                        <p className="text-gray-600">
                            Resend OTP in 00:{timer < 10 ? `0${timer}` : timer}
                        </p>
                    ) : (
                        <p className="text-green-500">You can now resend the OTP: 
                            <a onClick={handleResend} className={`cursor-pointer text-blue-500 ${resendActive ? '' : 'pointer-events-none'}`}>
                                Resend OTP
                            </a>
                        </p>
                    )}
                </div>
            </form>
            <ToastContainer /> 
        </>
    );
};

export default otp;
