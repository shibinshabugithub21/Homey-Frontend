// app/RootLayout.js (or wherever your RootLayout is defined)
"use client"; // Mark this component as a client component
import React,{ useEffect } from 'react';
import '../app/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/swiper-bundle.css'; 
import 'react-toastify/dist/ReactToastify.css'; 
import useStore from './store/useStore';


export default function RootLayout({ children }) {
  const { isDarkMode } = useStore();
  React.useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);
  return (
    <html lang="en" className={isDarkMode ? 'dark-mode' : ''}>
      <head>
        <link rel="icon" href="/favicon.png" />
        <title>Homey:Book a prefect services</title>
      </head>
      <body>
          {children} 
        {/* </Elements> */}
      </body>
    </html>
  );
}
