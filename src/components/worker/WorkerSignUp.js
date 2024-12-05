"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const WorkerSignUp = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();
  const [otpMethod, setOtpMethod] = useState("email");
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // State to hold error messages for each field
  const [errors, setErrors] = useState({
    fullname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Clear the error message for the current field when the user starts typing
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };


  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!formData.fullname) {
      newErrors.fullname = "Full name is required.";
    }

    if (!emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!phonePattern.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (10 digits).";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match.";
    }

    setErrors(newErrors); // Set error messages in state
    return Object.keys(newErrors).length === 0; // Return true if there are no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const isValid = validateForm();
    if (!isValid) {
      return; // Stop form submission if validation fails
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_Backend_Port}/worker/WorkerSignUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem("authToken", data.token);
        setMessage({ type: "success", text: "Signup successful! Please verify your account." });

        // Send OTP
        await sendOtp();
      } else {
        setMessage({ type: "error", text: data.message || "Signup failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error occurred during signup. Please try again." });
      console.error("Signup error:", error);
    }
  };

  const sendOtp = async () => {
    try {
      const otpResponse = await fetch(`${process.env.NEXT_PUBLIC_Backend_Port}/worker/Workersend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otpMethod }),
      });

      if (otpResponse.ok) {
        router.push(`/worker/Otp?method=${otpMethod}`);
      } else {
        const otpResult = await otpResponse.json();
        setMessage({ type: "error", text: otpResult.message || "OTP generation failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error occurred while sending OTP. Please try again." });
      console.error("OTP error:", error);
    }
  };

  const handleClick = () =>{
    window.location.href = `${process.env.NEXT_PUBLIC_Backend_Port}/auth/google`
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('access Token', token);
    if (token) {
      router.push('/worker/homepage');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Worker Sign Up</h2>
        {message.text && (
          <div className={`mb-4 ${message.type === "error" ? "text-red-500" : "text-green-500"}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {["fullname", "phone", "email", "password", "confirmPassword"].map((field, index) => (
            <div key={index}>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={field.includes("password") ? "password" : field === "phone" ? "tel" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring ${errors[field] ? 'border-red-500' : ''}`}
                placeholder={`Enter your ${field.replace(/([A-Z])/g, " $1")}`}
                required
              />
              {errors[field] && <p className="text-red-500 text-xs italic">{errors[field]}</p>}
            </div>
          ))}

          <div className="flex justify-center mb-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
            >
              Sign Up
            </button>
          </div>
        </form>

        <div className="mt-4">
          <button
            onClick={handleClick}
            className="w-full flex items-center justify-center p-2 bg-white border border-gray-300 rounded hover:bg-gray-100"
          >
            <img
              src="https://img.icons8.com/color/48/google-logo.png"
              alt="Google logo"
              style={{ width: "20px", marginRight: "8px" }}
            />
            Continue with Google
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <a href="/worker/SignIn" className="text-blue-500 hover:text-blue-700">
              signIn
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkerSignUp;
