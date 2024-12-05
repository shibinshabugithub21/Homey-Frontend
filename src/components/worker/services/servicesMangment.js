"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "@/components/admin/pagination";

const WorkerTaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [amount, setAmount] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Keep track of current page
  const tasksPerPage = 5; 

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const workerId = localStorage.getItem("workerId");

      if (!workerId) {
        toast.error("Worker ID is missing. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/worker/getBooking/${workerId}`);

        if (response.status === 200) {
          setTasks(response.data.bookings);
        } else {
          toast.error("Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Error fetching tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);
// Pagination Logic
const indexOfLastTask = currentPage * tasksPerPage;  // Correct the calculation of the last index
const indexOfFirstTask = indexOfLastTask - tasksPerPage;
const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);


  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected); // Update the current page when the page changes
  };

  const handlePayClick = (task) => {
    setSelectedTask(task);
    setAmount(task.serviceFee || ""); 
    localStorage.setItem("BookingId",task._id)
    setShowModal(true);
  };

  const handlePaySubmit = async () => {
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    try {
      const workerId = localStorage.getItem("workerId");

      const response = await axios.post(`${process.env.NEXT_PUBLIC_Backend_Port}/worker/updatePaymentAmount/${selectedTask._id}`, {
        amount: parsedAmount,
        workerId,
      });

      if (response.status === 200) {
        toast.success("Payment amount updated successfully");
        setShowModal(false);
        setAmount("");
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task._id === selectedTask._id ? { ...task, serviceFee: parsedAmount } : task))
        );
      } else {
        toast.error("Failed to update payment amount");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Error processing payment");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const workerId = localStorage.getItem("workerId");
      const response = await axios.put(`${process.env.NEXT_PUBLIC_Backend_Port}/worker/updateTaskStatus`, {
        taskId,
        status: newStatus,
        workerId,
      });

      if (response.status === 200) {
        toast.success("Task status updated successfully");
        setTasks((prevTasks) => prevTasks.map((task) => (task._id === taskId ? { ...task, status: newStatus } : task)));
      } else {
        toast.error("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Error updating task status");
    }
  };
  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-10 bg-white">
        <div className="relative flex items-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-teal-500 rounded-full animate-spin"></div>
          <img
            src="/logo.png"
            alt="Logo"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10"
          />
        </div>
        <p className="ml-4 text-lg font-semibold text-teal-700">Loading tasks...</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col p-6 bg-gray-100 h-screen">
      <h1 className="text-2xl font-bold mb-4">Worker Task Management</h1>
      <ToastContainer />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white shadow-md rounded">
            <thead className="bg-teal-500 text-white">
              <tr>
                <th className="p-4">Si.No</th>
                <th className="p-4">Booking ID</th> 
                <th className="p-4">Client Name</th>
                <th className="p-4">Service</th>
                <th className="p-4">Date</th>
                <th className="p-4">Location</th>
                <th className="p-4">Address</th>
                <th className="p-4">Service Fee</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.length > 0 ? (
                currentTasks.map((task, index) => (
                  <tr key={task._id} className="hover:bg-gray-200">
                    <td className="p-4 text-center">{index + 1}</td>
                    <td className="p-4">{task._id}</td>
                    <td className="p-4">{task.name}</td>
                    <td className="p-4">{task.services}</td>
                    <td className="p-4">{task.date.split('T')[0]}</td>
                    <td className="p-4">{task.location}</td>
                    <td className="p-4">{task.address}</td>
                    <td className="p-4">{task.serviceFee || 0}</td>
                    <td className="p-4">
                      {task.status === "Cancelled" ? (
                        <span className="text-red-500 font-bold">Cancelled</span>
                      ) : (
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          className="border rounded p-1"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In-Progress">In-Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      )}
                    </td>
                    <td className="p-4">
                      {task.status === "Cancelled" ? null : (
                        <button
                          className={`bg-teal-500 text-white px-4 py-2 rounded ${
                            task.paymentStatus === "Paid" ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          onClick={() => handlePayClick(task)}
                          disabled={task.paymentStatus === "Paid"}
                        >
                          Update Payment
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-4">
                    No tasks available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
  {/* Pagination Controls */}
          <Pagination
            totalItems={tasks.length}
            itemsPerPage={tasksPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Enter Payment Amount</h2>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter Amount"
              className="border p-2 rounded mb-4 w-full"
            />
            <div className="flex justify-between">
              <button className="bg-teal-500 text-white px-4 py-2 rounded" onClick={handlePaySubmit}>
                Submit
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerTaskManagement;
