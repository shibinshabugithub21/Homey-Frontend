import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from '@/components/footer';

const PersonalDetails = ({ onNext }) => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  // const [profile, setProfile] = useState("");
  // const [idProof, setIdProof] = useState("");
  const [errors, setErrors] = useState({});


  const fetchWorkerDetails = async () => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("authToken");
      console.log("Token fetched:", token);

      if (!token) {
        console.error("No auth token found. Please log in.");
        return;
      }

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_Backend_Port}/worker/WorkerDetails`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: ` Bearer ${token}`,
            },
          }
        );

        console.log("Response status:", response.status);
        console.log("Worker details:", response.data);

        const data = response.data[0];
        console.log(data.fullName + data.phone + data.email);
        setFullName(data.fullname);
        setPhone(data.phone);
        setEmail(data.email);
      } catch (error) {
        console.error("Error fetching worker details:", error);
      }
    } else {
      console.error("sessionStorage is not available. Make sure this runs in the browser.");
    }
  };

  useEffect(() => {
    fetchWorkerDetails();
  }, []);
  const validateForm = () => {
    const newErrors = {};

    if (!fullName) newErrors.fullName = "Full Name is required";
    if (!phone) newErrors.phone = "Phone Number is required";
    else if (!/^\d+$/.test(phone)) newErrors.phone = "Phone Number must be numeric";

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email format is invalid";

    if (!location) newErrors.location = "Location is required";
    if (!address) newErrors.address = "Address is required";
    if (!dob) newErrors.dob = "Date of Birth is required";
    if (!bloodGroup) newErrors.bloodGroup = "Blood Group is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const personalDetails = {
      fullName,
      phone,
      email,
      location,
      address,
      dob,
      bloodGroup,
   
    };

    localStorage.setItem("personalDetails", JSON.stringify(personalDetails));
    onNext();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("access Token", token);
    if (token) {
      router.push("/worker/homepage");
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Personal Details</h2>
      <div>
        <label htmlFor="fullName" className="block mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={`border rounded p-2 w-full ${errors.fullName ? 'border-red-500' : ''}`}
        />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block mb-1">
          Phone Number
        </label>
        <input
          type="text"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={`border rounded p-2 w-full ${errors.phone ? 'border-red-500' : ''}`}
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`border rounded p-2 w-full ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="location" className="block mb-1">
          Location
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={`border rounded p-2 w-full ${errors.location ? 'border-red-500' : ''}`}
        />
        {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
      </div>

      <div>
        <label htmlFor="address" className="block mb-1">
          Address
        </label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={`border rounded p-2 w-full ${errors.address ? 'border-red-500' : ''}`}
        />
        {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
      </div>

      <div>
        <label htmlFor="dob" className="block mb-1">
          Date of Birth
        </label>
        <input
          type="date"
          id="dob"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className={`border rounded p-2 w-full ${errors.dob ? 'border-red-500' : ''}`}
        />
        {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
      </div>

      <div>
        <label htmlFor="bloodGroup" className="block mb-1">
          Blood Group
        </label>
        <input
          type="text"
          id="bloodGroup"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          className={`border rounded p-2 w-full ${errors.bloodGroup ? 'border-red-500' : ''}`}
        />
        {errors.bloodGroup && <p className="text-red-500 text-sm">{errors.bloodGroup}</p>}
      </div>

      <button type="submit" className="bg-blue-500 text-white rounded p-2">
        Submit
      </button>
    </form>
    
  );
};

export default PersonalDetails;
