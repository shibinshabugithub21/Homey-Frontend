'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function StylishCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);

  // Load the selected date from local storage when the component mounts
  useEffect(() => {
    const storedDate = localStorage.getItem('selectedDate');
    if (storedDate) {
      setSelectedDate(new Date(storedDate)); // Parse the stored date
      setShowNextButton(true); // Show the Next button if a date was already selected
    }
  }, []);

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    // Fill in empty days for the first week
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // Generate days for the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
      
      days.push(
        <div
          key={i}
          onClick={() => {
            const localSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            setSelectedDate(localSelectedDate);
            setShowNextButton(true); // Show the Next button when a date is selected
            localStorage.setItem('selectedDate', localSelectedDate.toISOString()); // Save date to local storage
          }}
          className={`h-12 flex items-center justify-center rounded-lg cursor-pointer transition-colors
            ${isToday ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-700'}
            ${isSelected ? 'bg-green-500 text-white' : 'hover:bg-blue-100'}`}
        >
          <span className={`${isToday ? 'font-semibold' : ''}`}>{i}</span>
        </div>
      );
    }

    return days;
  };

  const changeMonth = (increment) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const handleNextClick = () => {
    // Navigate to the next page (you can replace this with your actual routing logic)
    window.location.href = '/Booking/issuse'; // Change to your next page route
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            aria-label="Previous month"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            aria-label="Next month"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-2 text-center font-medium text-gray-600">
        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {generateCalendarDays()}
      </div>
      {showNextButton && (
        <button 
          onClick={handleNextClick} 
          className="mt-4 w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 transition"
        >
          Next
        </button>
      )}
    </div>
  );
}
