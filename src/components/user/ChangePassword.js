import React, { useState } from "react";
import axios from "axios";

const ChangePassword = () => {
  // State for inputs
  const [currentPassword, setCurrentPassword] = useState(""); // New state for current password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State for validation errors
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // General message states
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages and errors
    setMessage("");
    setError("");
    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");

    // Validation checks
    let valid = true;

    if (!currentPassword) {
      setCurrentPasswordError("Current password is required.");
      valid = false;
    }

    if (!newPassword) {
      setNewPasswordError("New password is required.");
      valid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your new password.");
      valid = false;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      valid = false;
    }

    // If any validation failed, stop the form submission
    if (!valid) return;

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");

      // Send change password request
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_Backend_Port}/changePassword`,
        {
          currentPassword, // Include current password in the request
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        }
      );

      // Display success message
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      // Display error message from backend
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Change Password</h3>
      <form onSubmit={handleSubmit}>
        {/* Current Password */}
        <label className="block text-sm font-medium text-gray-700">
          Enter Current Password
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={`mt-1 block w-full px-3 py-2 border ${currentPasswordError ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        />
        {currentPasswordError && (
          <p className="text-red-500 text-sm mt-1">{currentPasswordError}</p>
        )}

        {/* New Password */}
        <label className="block text-sm font-medium text-gray-700 mt-4">
          Enter New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={`mt-1 block w-full px-3 py-2 border ${newPasswordError ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        />
        {newPasswordError && (
          <p className="text-red-500 text-sm mt-1">{newPasswordError}</p>
        )}

        {/* Confirm Password */}
        <label className="block text-sm font-medium text-gray-700 mt-4">
          Re-enter New Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`mt-1 block w-full px-3 py-2 border ${confirmPasswordError ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        />
        {confirmPasswordError && (
          <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
        )}

        {/* General Error and Success Messages */}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {message && <p className="text-green-500 mt-2">{message}</p>}

        <button
          type="submit"
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
