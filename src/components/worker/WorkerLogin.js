"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";

const WorkerLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateForm = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false;
    }

    return isValid;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage("");

  if (!validateForm()) {
    return;
  }

  try {
    console.log("Submitting form:", { email, password });

    const response = await fetch(`${process.env.NEXT_PUBLIC_Backend_Port}/worker/WorkerSignIn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log("Response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("Login successful, received data:", data);

      // Save the token and workerId to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("workerId", data.workerId); // Save workerId
      
      // Navigate to worker's homepage
      router.push("/worker/homepage");
    } else {
      const errorData = await response.json();
      console.error("Error from server:", errorData);
      setErrorMessage(errorData.message);
    }
  } catch (error) {
    console.error("Error logging in:", error);
    setErrorMessage("An unexpected error occurred. Please try again.");
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Worker Login</h2>

        {/* Display error message */}
        {errorMessage && <div className="mb-4 text-red-600 text-center">{errorMessage}</div>}

        <form noValidate onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
              placeholder="Enter your email"
              required
            />
            {emailError && <p className="text-red-600 text-sm">{emailError}</p>} {/* Display email error */}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring"
              placeholder="Enter your password"
              required
            />
            {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>} {/* Display password error */}
          </div>
          <div className="text-right">
            <Link href="/worker/ForgetPassword" className="text-blue-600 hover:underline text-sm">
              Forgot Password?
            </Link>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <a href="/worker/signUp" className="text-blue-500 hover:text-blue-700">
              SignUp
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkerLogin;
