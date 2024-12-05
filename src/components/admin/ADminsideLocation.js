'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "./pagination";

const AdminLocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({ name: "", icon: null });
  const [editingLocationId, setEditingLocationId] = useState(null);
  const [editingLocation, setEditingLocation] = useState({ name: "", icon: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/locations`);
      if (response.status === 200) {
        setLocations(response.data);
      } else {
        toast.error("Error fetching locations: " + response.data.message);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error(error.response?.data?.message || "Failed to fetch locations");
    }
  };

  const handleIconChange = (e) => {
    setNewLocation({ ...newLocation, icon: e.target.files[0] });
  };

  const handleAddLocation = async () => {
    const formData = new FormData();
    formData.append("name", newLocation.name);
    formData.append("icon", newLocation.icon);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/addlocation`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success("Location added successfully!");
        fetchLocations();
        setNewLocation({ name: "", icon: null });
      }
    } catch (error) {
      console.error("Error adding location:", error);
      toast.error(error.response?.data?.message || "Failed to add location");
    }
  };

  const handleEditLocation = (location) => {
    setEditingLocationId(location._id);
    setEditingLocation({ name: location.name, icon: null });
  };

  const handleSaveLocation = async () => {
    const formData = new FormData();
    formData.append("name", editingLocation.name);
    if (editingLocation.icon) {
      formData.append("icon", editingLocation.icon);
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_Backend_Port}/admin/editlocation/${editingLocationId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        toast.success("Location updated successfully!");
        fetchLocations();
        setEditingLocationId(null);
        setEditingLocation({ name: "", icon: null });
      }
    } catch (error) {
      console.error("Error saving location:", error);
      toast.error(error.response?.data?.message || "Failed to save location");
    }
  };

  const handleDeleteLocation = async (id) => {
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
          const response = await axios.delete(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/deletelocation/${id}`);
          if (response.data.success) {
            setLocations((prev) => prev.filter((loc) => loc._id !== id));
            toast.success("Location deleted successfully!");
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          console.error("Error deleting location:", error);
          toast.error(error.response?.data?.message || "Failed to delete location");
        }
      }
    });
  };

  const handleBlockUnblock = async (id, isBlocked) => {
    const action = isBlocked ? "Unblock" : "Block";

    Swal.fire({
      title: `Are you sure you want to ${action.toLowerCase()} this location?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${action.toLowerCase()} it!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/blocklocation/${id}`);
          if (response.data.success) {
            fetchLocations();
            toast.success(`Location ${action.toLowerCase()}ed successfully!`);
          } else {
            toast.error(`Error ${action.toLowerCase()}ing location: ${response.data.message}`);
          }
        } catch (error) {
          console.error(`Error ${action.toLowerCase()}ing location:`, error);
          toast.error(error.response?.data?.message || `Failed to ${action.toLowerCase()} location`);
        }
      }
    });
  };

  const indexOfLastLocation = currentPage * itemsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - itemsPerPage;
  const currentLocations = locations.slice(indexOfFirstLocation, indexOfLastLocation);

  return (
    <div className="flex h-screen bg-[#123] text-white">
      <main className="ml-64 p-8 w-full">
        <h1 className="text-4xl mb-6">Admin Location Management</h1>
        <ToastContainer />

        <div className="mb-8">
          <h2 className="text-2xl mb-4">Add New Location</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Location Name"
              value={newLocation.name}
              onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
              className="p-2 bg-gray-200 text-black rounded"
            />
            <input type="file" onChange={handleIconChange} className="p-2 bg-gray-200 text-black rounded" />
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:opacity-75" onClick={handleAddLocation}>
              Add Location
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-teal-600">
              <tr>
                <th className="p-4 border-b">Si.No</th>
                <th className="p-4 border-b">Location Name</th>
                <th className="p-4 border-b">Icon</th>
                <th className="p-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentLocations.map((location, index) => (
                <tr key={location._id} className="bg-[#234] hover:bg-teal-700">
                  <td className="p-4 border-b">{index + 1}</td>
                  <td className="p-4 border-b">
                    {editingLocationId === location._id ? (
                      <input
                        type="text"
                        value={editingLocation.name}
                        onChange={(e) => setEditingLocation({ ...editingLocation, name: e.target.value })}
                        className="p-2 bg-gray-200 text-black rounded"
                      />
                    ) : (
                      location.name
                    )}
                  </td>
                  <td className="p-4 border-b">
                    {editingLocationId === location._id ? (
                      <input
                        type="file"
                        onChange={(e) =>
                          setEditingLocation({ ...editingLocation, icon: e.target.files[0] })
                        }
                        className="p-2 bg-gray-200 text-black rounded"
                      />
                    ) : (
                      location.icon && <img src={location.icon} alt={location.name} className="h-12 w-12 object-cover" />
                    )}
                  </td>
                  <td className="p-4 border-b">
                    {editingLocationId === location._id ? (
                      <button
                        onClick={handleSaveLocation}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:opacity-75"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditLocation(location)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:opacity-75"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteLocation(location._id)}
                      className="ml-2 px-4 py-2 bg-red-600 text-white rounded hover:opacity-75"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleBlockUnblock(location._id, location.isBlocked)}
                      className={`ml-2 px-4 py-2 ${
                        location.isBlocked ? "bg-red-500" : "bg-green-500"
                      } text-white rounded hover:opacity-75`}
                    >
                      {location.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          totalItems={locations.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </main>
    </div>
  );
};

export default AdminLocationManagement;
