"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./pagination";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";

const AdminSideServicePage = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    name: "",
    category: "",
    icon: null,
    offer: "",
  });
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editingService, setEditingService] = useState({
    name: "",
    category: "",
    icon: null,
    offer: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_Backend_Port}/admin/services`
        );
        if (response.status === 200) {
          setServices(response.data);
        } else {
          alert("Error fetching services: " + response.data.message);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        alert(
          "Error fetching services: " +
            (error.response ? error.response.data.message : error.message)
        );
      }
    };

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_Backend_Port}/admin/categories`
        );
        if (response.status === 200) {
          const unblockedCategories = response.data.filter(
            (category) => !category.isBlocked
          );
          setCategories(unblockedCategories);
        } else {
          alert("Error fetching categories: " + response.data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        alert(
          "Error fetching categories: " +
            (error.response ? error.response.data.message : error.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
    fetchCategories();
  }, []);

  // Handle icon change
  const handleIconChange = (e) => {
    setNewService({ ...newService, icon: e.target.files[0] });
  };

  const handleAddService = async () => {
    const formData = new FormData();
    formData.append("name", newService.name);
    formData.append("category", newService.category);
    formData.append("offer", newService.offer);
    if (newService.icon) {
      formData.append("icon", newService.icon);
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_Backend_Port}/admin/addservices`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Service added successfully!");
        setServices([...services, response.data.data]);
        setNewService({ name: "", category: "", icon: null, offer: "" });
      }
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error(error.response?.data?.message || "Failed to add service");
    }
  };

  const handleEditService = (service) => {
    setEditingServiceId(service._id);
    setEditingService({
      name: service.name,
      category: service.category,
      icon: service.icon || null,
      offer: service.offer || "",
    });
  };

  const handleSaveService = async () => {
    if (!editingService.name.trim() || !editingService.category) {
      toast.error("Please fill in all required fields.");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", editingService.name);
    formData.append("category", editingService.category);
    formData.append("offer", editingService.offer);
    
    if (editingService.icon instanceof File) {
      formData.append("icon", editingService.icon);
    }
    for (let [key, value] of formData.entries()) {
      console.log('hjh',key, value);
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_Backend_Port}/admin/editservice/${editingServiceId}`,
        formData,
      );
  
      if (response.data.success) {
        setServices((prev) =>
          prev.map((svc) =>
            svc._id === editingServiceId ? response.data.data : svc
          )
        );
        setEditingServiceId(null);
        setEditingService({ name: "", category: "", icon: null, offer: "" });
        toast.success("Service updated successfully!");
      } else {
        toast.error("Error updating service: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error(error.response?.data?.message || "Error updating service.");
    }
  };
  

  const handleDeleteService = async (serviceId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
  
      if (result.isConfirmed) {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_Backend_Port}/admin/deleteservice/${serviceId}`
        );
  
        if (response.data.success) {
          setServices((prev) => prev.filter((svc) => svc._id !== serviceId));
          toast.success("Service deleted successfully!");
        } else {
          toast.error("Failed to delete service.");
        }
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Error deleting service: " + error.message);
    }
  };
  

  const handleBlockService = async (serviceId, isBlocked) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_Backend_Port}/admin/blockServices/${serviceId}`,
        { isBlocked: !isBlocked }
      );
  
      if (response.data.success) {
        setServices((prev) =>
          prev.map((svc) =>
            svc._id === serviceId
              ? { ...svc, isBlocked: !svc.isBlocked }
              : svc
          )
        );
        toast.success(
          `Service ${isBlocked ? "unblocked" : "blocked"} successfully!`
        );
      } else {
        toast.error("Failed to update service status.");
      }
    } catch (error) {
      console.error("Error blocking/unblocking service:", error);
      toast.error("Error updating service status: " + error.message);
    }
  };
  

  const indexOfLastService = currentPage * itemsPerPage;
  const indexOfFirstService = indexOfLastService - itemsPerPage;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);

  return (
    <div className="flex h-screen bg-[#123] text-white">
      <main className="ml-64 p-8 w-full">
        <h1 className="text-4xl mb-6">Admin Service Management</h1>
        <ToastContainer />
        {/* Add New Service Form */}
        <div className="mb-8">
          <h2 className="text-2xl mb-4">Add New Service</h2>
          <div className="flex gap-4">
            <input
              type="text"
              onChange={(e) =>
                setNewService({ ...newService, name: e.target.value })
              }
              placeholder="Service Name"
              className="p-2 bg-gray-200 text-black rounded"
            />
            <input
              type="text"
              onChange={(e) =>
                setNewService({ ...newService, offer: e.target.value })
              }
              placeholder="Offer"
              className="p-2 bg-gray-200 text-black rounded"
            />
            <select
              value={newService.category}
              onChange={(e) =>
                setNewService({ ...newService, category: e.target.value })
              }
              className="p-2 bg-gray-200 text-black rounded"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.Category}
                </option>
              ))}
            </select>
            <input
              type="file"
              onChange={handleIconChange}
              className="p-2 bg-gray-200 text-black rounded"
            />
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:opacity-75"
              onClick={handleAddService}
            >
              Add Service
            </button>
          </div>
        </div>

        {/* Service Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-teal-600">
              <tr>
                <th className="p-4 border-b">Si.No</th>
                <th className="p-4 border-b">Service Name</th>
                <th className="p-4 border-b">Category</th>
                <th className="p-4 border-b">Offer</th>
                <th className="p-4 border-b">Icon</th>
                <th className="p-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentServices.map((service, index) => (
                <tr key={service._id} className="bg-[#234] hover:bg-teal-700">
                  <td className="p-4 border-b">{index + 1}</td>
                  <td className="p-4 border-b">
                    {editingServiceId === service._id ? (
                      <input
                        type="text"
                        value={editingService.name}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            name: e.target.value,
                          })
                        }
                        className="p-2 bg-gray-200 text-black rounded"
                      />
                    ) : (
                      service.name
                    )}
                  </td>
                  <td className="p-4 border-b">
                    {editingServiceId === service._id ? (
                      <select
                        value={editingService.category}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            category: e.target.value,
                          })
                        }
                        className="p-2 bg-gray-200 text-black rounded"
                      >
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.Category}
                          </option>
                        ))}
                      </select>
                    ) : (
                      categories.find((cat) => cat._id === service.category)
                        ?.Category || "Unknown"
                    )}
                  </td>
                  <td className="p-4 border-b">
                    {editingServiceId === service._id ? (
                      <input
                        type="text"
                        value={editingService.offer}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            offer: e.target.value,
                          })
                        }
                        className="p-2 bg-gray-200 text-black rounded"
                      />
                    ) : (
                      service.offer || "N/A"
                    )}
                  </td>
                  <td className="p-4 border-b">
                    <img
                      src={service.icon}
                      alt={service.name}
                      className="h-12 w-12 object-cover"
                    />
                  </td>
                  <td className="p-4 border-b">
                    {editingServiceId === service._id ? (
                      <button
                        onClick={handleSaveService}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:opacity-75"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditService(service)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:opacity-75"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteService(service._id)}
                      className="ml-2 px-4 py-2 bg-red-600 text-white rounded hover:opacity-75"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        handleBlockService(service._id, service.isBlocked)
                      }
                      className={`ml-2 px-4 py-2 text-white rounded hover:opacity-75 ${
                        service.isBlocked ? "bg-yellow-600" : "bg-green-600"
                      }`}
                    >
                      {service.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          totalItems={services.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage} // Update current page
        />
      </main>
    </div>
  );
};

export default AdminSideServicePage;
