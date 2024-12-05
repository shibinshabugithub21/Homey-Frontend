// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Footer Top Section */}
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h5 className="text-lg font-bold mb-2">About Homey</h5>
            <p className="text-sm">
              Homey connects homeowners with skilled professionals offering a variety of services,
              ensuring quality and convenience for all your home needs.
            </p>
          </div>
          <div className="mb-4 md:mb-0">
            <h5 className="text-lg font-bold mb-2">Quick Links</h5>
            <ul>
              <li>
                <a href="#" className="text-gray-400 hover:text-gray-300">Home</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-gray-300">Services</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-gray-300">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-gray-300">Contact Us</a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-lg font-bold mb-2">Follow Us</h5>
            <div className="flex">
              <a href="#" className="text-gray-400 hover:text-gray-300 mx-2">
                <i className="fab fa-facebook"></i> {/* Font Awesome icons */}
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 mx-2">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 mx-2">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 mx-2">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mb-6">
          <h5 className="text-lg font-bold mb-2">Subscribe to Our Newsletter</h5>
          <form className="flex flex-col md:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 rounded-l-md w-full md:w-1/3"
            />
            <button className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-r-md">
              Subscribe
            </button>
          </form>
        </div>

        {/* Footer Bottom Section */}
        <div className="text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Homey. All rights reserved.
          </p>
          <div className="mt-2">
            <a href="#" className="text-gray-400 hover:text-gray-300 mx-2">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-gray-300 mx-2">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
