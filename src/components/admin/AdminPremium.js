"use client";
import React, { useEffect, useState } from "react";
import { fetchSubscriptions, addSubscription, editSubscription, deleteSubscription, blockSubscription } from "@/config/subscriptionService";
import Pagination from "./pagination";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";

const AdminPlanManagementPage = () => {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({
    type: "",
    services: [""],
    amount: "",
  });
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editingPlan, setEditingPlan] = useState({
    type: "",
    services: [""],
    amount: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetchSubscriptions();
        if (response.status === 200) {
          setPlans(response.data.data);
        } else {
          alert("Error fetching plans: " + response.data.message);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        alert("Error fetching plans: " + (error.response?.data?.message || error.message));
      }
    };

    fetchPlans();
  }, []);

  const handleAddPlan = async () => {
    if (!newPlan.type || !newPlan.services.length || !newPlan.amount) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const response = await addSubscription(newPlan);
      if (response.data.message) {
        toast.success("Plan added successfully!");
        setPlans([...plans, response.data.data]);
        setNewPlan({ type: "", services: [""], amount: "" });
      }
    } catch (error) {
      console.error("Error adding plan:", error);
      toast.error("Failed to add plan.");
    }
  };

  const handleEditPlan = (plan) => {
    setEditingPlanId(plan._id);
    setEditingPlan({ type: plan.type, services: plan.offer, amount: plan.amount });
  };

  const handleSavePlan = async () => {
    if (!editingPlan.type || !editingPlan.services.length || !editingPlan.amount) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const response = await editSubscription(editingPlanId, editingPlan);
      if (response.data.message) {
        setPlans((prev) =>
          prev.map((plan) => (plan._id === editingPlanId ? response.data.data : plan))
        );
        setEditingPlanId(null);
        setEditingPlan({ type: "", services: [""], amount: "" });
        toast.success("Plan updated successfully!");
      }
    } catch (error) {
      console.error("Error updating plan:", error);
      toast.error("Failed to update plan.");
    }
  };

  const handleDeletePlan = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteSubscription(id);
          if (response.status === 200) {
            setPlans(plans.filter((plan) => plan._id !== id));
            toast.success("Plan deleted successfully!");
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          console.error("Error deleting plan:", error);
          toast.error("Failed to delete plan.");
        }
      }
    });
  };

  const handleBlockUnblockPlan = async (id, isBlocked) => {
    const action = isBlocked ? "Unblock" : "Block";

    Swal.fire({
      title: `Are you sure you want to ${action} this plan?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${action}!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await blockSubscription(id);
          if (response.data.message) {
            setPlans((prevPlans) =>
              prevPlans.map((plan) =>
                plan._id === id ? response.data.data : plan
              )
            );
            toast.success(`Plan ${action.toLowerCase()}ed successfully!`);
          }
        } catch (error) {
          console.error(`Error ${action.toLowerCase()}ing plan:`, error);
          toast.error(`Failed to ${action.toLowerCase()} plan.`);
        }
      }
    });
  };

  const handleServiceChange = (index, value) => {
    const updatedServices = [...editingPlan.services];
    updatedServices[index] = value;
    setEditingPlan({ ...editingPlan, services: updatedServices });
  };

  const addServiceField = (isEditing = false) => {
    if (isEditing) {
      setEditingPlan({ ...editingPlan, services: [...editingPlan.services, ""] });
    } else {
      setNewPlan({ ...newPlan, services: [...newPlan.services, ""] });
    }
  };

  const removeServiceField = (index, isEditing = false) => {
    if (isEditing) {
      const updatedServices = editingPlan.services.filter((_, i) => i !== index);
      setEditingPlan({ ...editingPlan, services: updatedServices });
    } else {
      const updatedServices = newPlan.services.filter((_, i) => i !== index);
      setNewPlan({ ...newPlan, services: updatedServices });
    }
  };

  const indexOfLastPlan = currentPage * itemsPerPage;
  const indexOfFirstPlan = indexOfLastPlan - itemsPerPage;
  const currentPlans = plans.slice(indexOfFirstPlan, indexOfLastPlan);

  return (
    <div className="flex h-screen bg-[#123] text-white">
      <main className="ml-64 p-8 w-full">
        <h1 className="text-4xl mb-6">Admin Plan Management</h1>
        <ToastContainer />
        <div className="mb-8">
          <h2 className="text-2xl mb-4">Add New Plan</h2>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newPlan.type}
                onChange={(e) => setNewPlan({ ...newPlan, type: e.target.value })}
                placeholder="Plan Type"
                className="p-3 bg-gray-200 text-black rounded w-1/2"
              />
              <input
                type="text"
                value={newPlan.amount}
                onChange={(e) => setNewPlan({ ...newPlan, amount: e.target.value })}
                placeholder="Amount"
                className="p-3 bg-gray-200 text-black rounded w-1/2"
              />
            </div>
            <div>
              {newPlan.services.map((service, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={service}
                    onChange={(e) =>
                      setNewPlan({
                        ...newPlan,
                        services: newPlan.services.map((s, i) => (i === index ? e.target.value : s)),
                      })
                    }
                    placeholder="Service"
                    className="p-3 bg-gray-200 text-black rounded"
                  />
                  {newPlan.services.length > 1 && (
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded"
                      onClick={() => removeServiceField(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => addServiceField()}
              >
                Add Service
              </button>
            </div>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:opacity-75"
              onClick={handleAddPlan}
            >
              Add Plan
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-teal-600">
              <tr>
                <th className="p-4 border-b">Si.No</th>
                <th className="p-4 border-b">Plan Type</th>
                <th className="p-4 border-b">Services</th>
                <th className="p-4 border-b">Amount</th>
                <th className="p-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentPlans.map((plan, index) => (
                <tr key={plan._id}>
                  <td className="p-4 border-b">{indexOfFirstPlan + index + 1}</td>
                  <td className="p-4 border-b">
                    {editingPlanId === plan._id ? (
                      <input
                        type="text"
                        value={editingPlan.type}
                        onChange={(e) =>
                          setEditingPlan({ ...editingPlan, type: e.target.value })
                        }
                        className="p-3 bg-gray-200 text-black rounded w-full"
                      />
                    ) : (
                      plan.type
                    )}
                  </td>
                  <td className="p-4 border-b">
                    {editingPlanId === plan._id ? (
                      <div>
                        {editingPlan.services.map((service, serviceIndex) => (
                          <div key={serviceIndex} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={service}
                              onChange={(e) => handleServiceChange(serviceIndex, e.target.value)}
                              className="p-3 bg-gray-200 text-black rounded w-full"
                            />
                            {editingPlan.services.length > 1 && (
                              <button
                                className="px-4 py-2 bg-red-600 text-white rounded"
                                onClick={() => removeServiceField(serviceIndex, true)}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded"
                          onClick={() => addServiceField(true)}
                        >
                          Add Service
                        </button>
                      </div>
                    ) : (
                      plan.offer?.join(", ")
                    )}
                  </td>
                  <td className="p-4 border-b">
                    {editingPlanId === plan._id ? (
                      <input
                        type="text"
                        value={editingPlan.amount}
                        onChange={(e) =>
                          setEditingPlan({ ...editingPlan, amount: e.target.value })
                        }
                        className="p-3 bg-gray-200 text-black rounded w-full"
                      />
                    ) : (
                      plan.amount
                    )}
                  </td>
                  <td className="p-4 border-b">
                    {editingPlanId === plan._id ? (
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded"
                        onClick={handleSavePlan}
                      >
                        Save
                      </button>
                    ) : (
                      <>
                        <button
                          className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
                          onClick={() => handleEditPlan(plan)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-4 py-2 bg-red-600 text-white rounded mr-2"
                          onClick={() => handleDeletePlan(plan._id)}
                        >
                          Delete
                        </button>
                        <button
                          className={`px-4 py-2 ${
                            plan.isBlocked ? "bg-gray-500" : "bg-blue-500"
                          } text-white rounded`}
                          onClick={() =>
                            handleBlockUnblockPlan(plan._id, plan.isBlocked)
                          }
                        >
                          {plan.isBlocked ? "Unblock" : "Block"}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          totalItems={plans.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </main>
    </div>
  );
};

export default AdminPlanManagementPage;
