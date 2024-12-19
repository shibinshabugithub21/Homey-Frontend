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

  useEffect(() => {
    const storedDate = localStorage.getItem('selectedDate');
    if (storedDate) {
      const [year, month, day] = storedDate.split('-').map(Number);
      setSelectedDate(new Date(year, month - 1, day));
      setShowNextButton(true);
    }
  }, []);

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();

      days.push(
        <div
          key={i}
          onClick={() => handleDateClick(i)}
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

  const handleDateClick = (day) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selected);
    setShowNextButton(true);
    const formattedDate = `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, '0')}-${String(selected.getDate()).padStart(2, '0')}`;
    localStorage.setItem('selectedDate', formattedDate);
  };

  const changeMonth = (increment) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const handleNextClick = () => {
    window.location.href = '/Booking/issuse';
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
