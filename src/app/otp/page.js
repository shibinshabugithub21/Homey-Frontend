'use client'; 

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; 
import OTPVerification from '@/components/otpVerification'; 

const OTPPage = () => {
    const router=useSearchParams()
    const email=router.get('email')
    console.log("email",email);
    
    const phone = null; 

    const contactInfo = {
        email: email || '', 
        phone: phone, 
    };
    const contactType = contactInfo.email ? 'email' : 'phone';

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <OTPVerification contactInfo={contactInfo} contactType={contactType} />
        </div>
    );
};

export default OTPPage;
