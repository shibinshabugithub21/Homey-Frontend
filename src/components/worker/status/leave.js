'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";

const LeaveSetup = () => {
  const [leaveType, setLeaveType] = useState("Full Day");
  const [leaveDate, setLeaveDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // State for field-specific error messages
  const [errors, setErrors] = useState({
    leaveDate: "",
    reason: "",
  });

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      const workerId = localStorage.getItem("workerId");
      if (!workerId) {
        setErrorMessage("No worker ID found. Please log in.");
        return;
      }
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/worker/getLeaves/${workerId}`);
        setLeaveHistory(response.data.leaves);
      } catch (error) {
        console.error("Error fetching leave history:", error);
        setErrorMessage("Failed to load leave history.");
      }
    };
    fetchLeaveHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    let hasError = false;
    const newErrors = { leaveDate: "", reason: "" };

    // Validate leave date
    const selectedDate = new Date(leaveDate);
    const currentDate = new Date();
    if (!leaveDate) {
      newErrors.leaveDate = "Leave date is required.";
      hasError = true;
    } else if (selectedDate < currentDate) {
      newErrors.leaveDate = "Leave date cannot be in the past.";
      hasError = true;
    }

    // Validate reason
    if (!reason.trim()) {
      newErrors.reason = "Reason for leave cannot be empty.";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      const workerId = localStorage.getItem("workerId");
      if (!workerId) {
        setErrorMessage("No worker ID found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_Backend_Port}/worker/markLeave/${workerId}`,
        { leaveType, leaveDate, reason }
      );

      setSuccessMessage("Leave application submitted successfully!");
      setLeaveHistory([...leaveHistory, { leaveType, leaveDate, reason }]);
      setLeaveType("Full Day");
      setLeaveDate("");
      setReason("");
      setErrors({ leaveDate: "", reason: "" }); // Reset errors on success
    } catch (error) {
      console.error("Error submitting leave application:", error);
      setErrorMessage(error.response?.data?.message || "Failed to submit leave application.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Apply for Leave</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Leave Type</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="mt-2 w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Full Day">Full Day</option>
              <option value="Half Day">Half Day</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Leave Date</label>
            <input
              type="date"
              value={leaveDate}
              onChange={(e) => setLeaveDate(e.target.value)}
              className="mt-2 w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.leaveDate && (
              <p className="text-red-500 text-sm mt-2">{errors.leaveDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-2 w-full p-2 border border-gray-300 rounded-md"
              rows="4"
              placeholder="Provide a valid reason for leave"
            ></textarea>
            {errors.reason && (
              <p className="text-red-500 text-sm mt-2">{errors.reason}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Apply for Leave"}
          </button>
        </form>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Leave History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Leave Type</th>
                <th className="py-2 px-4 text-left">Leave Date</th>
                <th className="py-2 px-4 text-left">Reason</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.length > 0 ? (
                leaveHistory.map((leave, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{leave.leaveType}</td>
                    <td className="py-2 px-4">{formatDate(leave.leaveDate)}</td>
                    <td className="py-2 px-4">{leave.reason}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-2 px-4 text-center text-gray-500">
                    No leave history available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {errorMessage && <p className="mt-4 text-center text-red-500">{errorMessage}</p>}
      {successMessage && <p className="mt-4 text-center text-green-500">{successMessage}</p>}
    </div>
  );
};

export default LeaveSetup;
