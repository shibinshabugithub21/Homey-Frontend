'use client';
import React, { useState } from 'react';
import Footer from '@/components/footer';
import PersonalDetails from '@/components/worker/PersonalDetails';
import EducationDetails from '@/components/worker/EducationDetails';
const Page = () => {
  const [step, setStep] = useState(1);
  const [personalData, setPersonalData] = useState({});
  const [educationData, setEducationData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNextStep = (data) => {
    setPersonalData(data);
    setStep(2); 
  };

  const handleSubmitEducation = async (data) => {
    setEducationData(data);
    setLoading(true);
    setError(null); // Reset error state

    try {
      const response = await fetch('http://localhost:5000/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalData,
          educationData: data,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit data');
      }

      const result = await response.json();
      console.log('Submission successful:', result);
    } catch (error) {
      console.error('Error submitting data:', error);
      setError('An error occurred while submitting your data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
    <div className="flex-grow max-w-md mx-auto p-5">
      {error && <div className="text-red-500">{error}</div>}
      {loading && <div>Loading...</div>}
      
      {step === 1 ? (
        <PersonalDetails onNext={handleNextStep} />
      ) : (
        <EducationDetails onSubmit={handleSubmitEducation} />
      )}
    </div>
    <Footer className="h-20 bg-gray-800 text-white flex items-center justify-center p-4" />
  </div>
  );
};

export default Page;
