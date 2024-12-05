"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Pagination from "./pagination";
import { toast, ToastContainer } from "react-toastify";
import { io } from "socket.io-client";
import RequestModal from "./RequestModal"; // Import the RequestModal

const socket = io(`${process.env.NEXT_PUBLIC_Backend_Port}`);

const WorkerManagementPage = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/workers`);
        if (response.status === 200) {
          setWorkers(response.data);
        } else {
          toast.error("Error fetching workers: " + response.data.message);
        }
      } catch (error) {
        toast.error(
          "Error fetching data: " +
            (error.response ? error.response.data.message : error.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();

    socket.on("newWorkerRequest", (workerData) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        workerData,
      ]);
      toast.info(`New worker registration request from ${workerData.name}`);
    });

    return () => {
      socket.off("newWorkerRequest");
    };
  }, []);

  const handleRequestButtonClick = () => {
    setShowRequestModal(true);
  };

  const handleApproveWorker = async (id) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_Backend_Port}/admin/acceptworker/${id}`
      );
      if (response.data.success) {
        const updatedWorkers = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/workers`);
        setWorkers(updatedWorkers.data);
        toast.success("Worker approved!");
      } else {
        toast.error("Error approving worker: " + response.data.message);
      }
    } catch (error) {
      toast.error(
        "Error approving worker: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const handleRejectWorker = async (id, reason) => {
    const confirmReject = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to reject this worker?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject!",
      cancelButtonText: "Cancel",
    });
  
    if (!confirmReject.isConfirmed) return;
  
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_Backend_Port}/admin/deleteworkers/${id}`,
        { data: { reason } } // Send reason to the backend
      );
  
      if (response.data.success) {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
        setWorkers((prevWorkers) => prevWorkers.filter((worker) => worker._id !== id));
        toast.success("Worker rejected and deleted successfully!");
      } else {
        throw new Error(response.data.message || "Failed to reject worker");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
      Swal.fire("Error", `Error rejecting worker: ${errorMessage}`, "error");
    }
  };
  
  const handleToggleBlock = async (workerId) => {
  const confirmBlock = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to block or unblock this worker?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, block/unblock!",
    cancelButtonText: "Cancel",
  });

  if (confirmBlock.isConfirmed) {
    try {
      // Call the block/unblock API endpoint
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_Backend_Port}/admin/workerblock/${workerId}`
      );

      if (response.data.success) {
        // Update the worker list if block/unblock was successful
        const updatedWorkers = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/workers`);
        setWorkers(updatedWorkers.data);
        toast.success("Worker status updated successfully!");
      } else {
        toast.error("Error updating worker status");
      }
    } catch (error) {
      toast.error(
        "Error blocking/unblocking worker: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
  }
};

  
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentWorkers = workers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="flex h-screen bg-[#123] text-white overflow-hidden">
      <main className="ml-64 p-8 w-full">
        <h1 className="text-4xl mb-6">Worker Management</h1>

        {/* Requests Button */}
        <button
          className="bg-teal-600 text-white py-2 px-4 rounded mb-4 hover:bg-teal-700 relative"
          onClick={handleRequestButtonClick}
        >
          Requests ({notifications.length})
        </button>

        {/* Table Display */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-teal-600">
              <tr>
                <th className="p-4 border-b">Si.No</th>
                <th className="p-4 border-b">Worker ID</th>
                <th className="p-4 border-b">Name</th>
                <th className="p-4 border-b">Department</th>
                <th className="p-4 border-b">Location</th>
                <th className="p-4 border-b">Date of Join</th>
                <th className="p-4 border-b">Phone</th>
                <th className="p-4 border-b">Email</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentWorkers.map((worker, index) => (
                <tr key={worker._id} className="bg-[#234] hover:bg-teal-700">
                  <td className="p-4 border-b">{index + 1}</td>
                  <td className="p-4 border-b">{worker._id}</td>
                  <td className="p-4 border-b">{worker.fullname}</td>
                  <td className="p-4 border-b">{worker.employment.department || "N/A"}</td>
                  <td className="p-4 border-b">{worker.location}</td>
                  <td className="p-4 border-b">{new Date(worker.dateOfJoin).toLocaleDateString()}</td>
                  <td className="p-4 border-b">{worker.phone}</td>
                  <td className="p-4 border-b">{worker.email}</td>
                  <td className="p-4 border-b">{worker.availabilityStatus}</td>
                  <td className="p-4 border-b flex gap-2">
                    <button
                      className={`px-4 py-2 rounded text-white ${
                        worker.isBlocked ? "bg-red-600" : "bg-green-600"
                      } hover:opacity-75`}
                      onClick={() => handleToggleBlock(worker._id)}
                    >
                      {worker.isBlocked ? "Unblock" : "Block"}
                    </button>
                   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            totalItems={workers.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      <ToastContainer />

      {showRequestModal && (
        <RequestModal
          notifications={notifications}
          onApprove={handleApproveWorker}
          onReject={handleRejectWorker}
          onClose={() => setShowRequestModal(false)}
        />
      )}
    </div>
  );
};

export default WorkerManagementPage;
