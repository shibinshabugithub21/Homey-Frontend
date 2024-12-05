"use client";
import React, { useState ,useEffect} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import { signIn } from "next-auth/react";

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otpMethod, setOtpMethod] = useState("email");
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpMethodChange = (e) => {
    setOtpMethod(e.target.value);
  };

  const validateForm = () => {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!formData.fullname) {
      errors.fullname = "Full name is required";
    }

    if (!emailPattern.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!phonePattern.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    if (!passwordPattern.test(formData.password)) {
      errors.password =
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setSuccessMessage("");

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_Backend_Port}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        const { token } = data;
        sessionStorage.setItem("authToken", token); // Save token to session storage
        setSuccessMessage("Signup successful! Please verify your account.");

        const otpResponse = await fetch(`${process.env.NEXT_PUBLIC_Backend_Port}/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            otpMethod,
            email: otpMethod === "email" ? formData.email : undefined,
            phone: otpMethod === "phone" ? formData.phone : undefined,
          }),
        });

        if (otpResponse.ok) {
          const queryParams = new URLSearchParams({
            [otpMethod]: otpMethod === "email" ? formData.email : formData.phone,
          }).toString();

          router.push(`/otp?${queryParams}`);
        } else {
          const otpResult = await otpResponse.json();
          setFormErrors({ general: otpResult.message || "OTP generation failed" });
        }
      } else {
        setFormErrors({ general: data.message || "Signup failed" });
      }
    } catch (error) {
      setFormErrors({ general: "Error occurred during signup. Please try again." });
      console.error("Signup error:", error);
    }
  };

  useEffect(()=>{
    const token = localStorage.getItem('token')
    console.log('access Token',token);
    if(token){
      router.push('/userHome')
    }
  },[])

  const handleClick = () =>{
    window.location.href = `${process.env.NEXT_PUBLIC_Backend_Port}/auth/google`
  }

  const handleBackgroundClick = (e) => {
    const container = e.currentTarget;
    const bubble = document.createElement('div');
    const x = e.clientX - container.offsetLeft;
    const y = e.clientY - container.offsetTop;

    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;
    bubble.className = 'bubble';
    container.appendChild(bubble);

    setTimeout(() => {
      bubble.remove();
    }, 1000); // Remove bubble after animation
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-center text-2xl font-bold mb-4">Sign Up</h2>

        {formErrors.general && <div className="text-red-500 mb-4">{formErrors.general}</div>}
        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Full Name Field */}
          <div>
    <label className="block text-sm font-medium">Full Name</label>
    <input
      type="text"
      name="fullname"
      value={formData.fullname}
      onChange={handleChange}
      className={`mt-1 p-2 w-full h-12 border rounded ${
        formErrors.fullname ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
      }`}
      placeholder="Enter your full name"
      required
    />
    {formErrors.fullname && <p className="text-red-500 text-sm">{formErrors.fullname}</p>}
  </div>

  {/* Phone Number Field */}
  <div>
    <label className="block text-sm font-medium">Phone Number</label>
    <input
      type="tel"
      name="phone"
      value={formData.phone}
      onChange={handleChange}
      className={`mt-1 p-2 w-full h-12 border rounded ${
        formErrors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
      }`}
      placeholder="Enter your phone number"
      required
    />
    {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
  </div>

  {/* Email Field */}
  <div>
    <label className="block text-sm font-medium">Email</label>
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      className={`mt-1 p-2 w-full h-12 border rounded ${
        formErrors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
      }`}
      placeholder="Enter your email"
      required
    />
    {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
  </div>

  {/* Password Field */}
  <div>
    <label className="block text-sm font-medium">Password</label>
    <input
      type="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      className={`mt-1 p-2 w-full h-12 border rounded ${
        formErrors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
      }`}
      placeholder="Enter your password"
      required
    />
    {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
  </div>

  {/* Confirm Password Field */}
  <div>
    <label className="block text-sm font-medium">Confirm Password</label>
    <input
      type="password"
      name="confirmPassword"
      value={formData.confirmPassword}
      onChange={handleChange}
      className={`mt-1 p-2 w-full h-12 border rounded ${
        formErrors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
      }`}
      placeholder="Re-enter your password"
      required
    />
    {formErrors.confirmPassword && <p className="text-red-500 text-sm">{formErrors.confirmPassword}</p>}
  </div>

          {/* OTP Method Selection */}
          <div>
            <label className="block text-sm font-medium">Receive OTP via:</label>
            <div className="flex items-center">
              <input
                type="radio"
                id="otpEmail"
                name="otpMethod"
                value="email"
                checked={otpMethod === "email"}
                onChange={handleOtpMethodChange}
              />
              <label htmlFor="otpEmail" className="ml-2">
                Email
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="otpPhone"
                name="otpMethod"
                value="phone"
                checked={otpMethod === "phone"}
                onChange={handleOtpMethodChange}
              />
              <label htmlFor="otpPhone" className="ml-2">
                Phone
              </label>
            </div>
          </div>

          {/* Sign Up Button */}
          <div>
            <button
              type="submit"
              className="w-full p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* Google Sign-up Button */}
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

        <div className="mt-4 text-center">
          Already have an account?{" "}
          <Link href="/signIn" className="text-indigo-600 hover:text-indigo-800">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
