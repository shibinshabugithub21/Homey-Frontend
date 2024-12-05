import React, { useState } from "react";
import Swal from "sweetalert2";

const RequestModal = ({ notifications, onApprove, onReject, onClose }) => {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);

  const handleReject = (workerId) => {
    setSelectedWorkerId(workerId);
    setShowRejectModal(true);
  };

  const submitRejection = () => {
    if (!rejectReason) {
      Swal.fire("Error", "Please provide a reason for rejection", "error");
      return;
    }
    onReject(selectedWorkerId, rejectReason);
    setShowRejectModal(false);
    setRejectReason("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white text-black p-4 rounded-md max-w-lg w-full">
        <h2 className="text-lg font-semibold mb-4">Pending Worker Requests</h2>
        {notifications.length === 0 ? (
          <p className="text-center">No pending requests.</p>
        ) : (
          notifications.map((worker) => (
            <div key={worker.id} className="border p-3 mb-3 rounded-md">
              <p>Name: {worker.name}</p>
              <p>Email: {worker.email}</p>
              <p>Department: {worker.department}</p>
              <div className="flex justify-between mt-2">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  onClick={() => onApprove(worker.id)}
                >
                  Approve
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  onClick={() => handleReject(worker.id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
        <button
          className="mt-4 w-full bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
          onClick={onClose}
        >
          Close
        </button>

        {/* Rejection Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded-md max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-2">Rejection Reason</h3>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection"
                className="w-full border rounded p-2 mb-3"
              />
              <div className="flex justify-end">
                <button
                  className="bg-gray-600 text-white px-3 py-1 rounded mr-2"
                  onClick={() => setShowRejectModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={submitRejection}
                >
                  Submit Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestModal;
