"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from "./pagination";

const AdminSideCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newOffer, setNewOffer] = useState("");  // Offer state
  const [loading, setLoading] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategory, setEditingCategory] = useState("");
  const [editingOffer, setEditingOffer] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/categories`);
        if (response.status === 200) {
          setCategories(response.data);
        } else {
          toast.error("Error fetching categories: " + response.data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Error fetching data: " + (error.response ? error.response.data.message : error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/addcategory`, {
        Category: newCategory.trim(),
        offer: newOffer.trim()  // Send 'offer' in lowercase here
      });

      if (response.data.success) {
        setCategories((prevCategories) => [...prevCategories, response.data.data]);
        setNewCategory(""); 
        setNewOffer(""); // Reset Offer input
        toast.success("Category added successfully!");
      } else {
        toast.error("Error adding category: " + response.data.message);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Error adding category: " + (error.response ? error.response.data.message : error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategoryId(category._id);
    setEditingCategory(category.Category);
    setEditingOffer(category.Offer)
  };

  const handleSaveCategory = async (id) => {
    if (!editingCategory.trim()) {
      toast.error("Please enter a valid category name.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/editcategory/${id}`, { 
        Category: editingCategory ,
        offer:editingOffer.trim()
      });

      if (response.data.success) {
        setCategories((prevCategories) => prevCategories.map((cat) => (cat._id === id ? response.data.data : cat)));
        setEditingCategoryId(null);
        setEditingCategory("");
        setEditingOffer('')
        toast.success("Category updated successfully!");
      } else {
        toast.error("Error updating category: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Error updating category: " + (error.response ? error.response.data.message : error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCategory = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/deleteCategory/${id}`);

        if (response.data.success) {
          setCategories((prevCategories) => prevCategories.filter((cat) => cat._id !== id));
          toast.success("Category removed successfully!");
        } else {
          toast.error("Error removing category: " + response.data.message);
        }
      } catch (error) {
        console.error("Error removing category:", error);
        toast.error("Error removing category: " + (error.response ? error.response.data.message : error.message));
      }
    }
  };

  const handleToggleBlock = async (id, currentStatus) => {
    const action = currentStatus ? "unblock" : "block";
    const result = await Swal.fire({
      title: `Are you sure you want to ${action} this category?`,
      text: "You can revert this action later.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: currentStatus ? '#3085d6' : '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: `Yes, ${action} it!`
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/blockorunblock/${id}`, {
          isBlocked: !currentStatus // Explicitly passing the new block/unblock status
        });

        if (response.data.success) {
          setCategories((prevCategories) => prevCategories.map((cat) => (cat._id === id ? response.data.data : cat)));
          toast.success(`Category ${action}ed successfully!`);
        } else {
          toast.error("Error updating category status: " + response.data.message);
        }
      } catch (error) {
        console.error("Error updating category status:", error);
        toast.error("Error updating category status: " + (error.response ? error.response.data.message : error.message));
      }
    }
  };

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="flex h-screen bg-[#123] text-white">
      <main className="ml-64 p-8 w-full">
        <h1 className="text-4xl mb-6">Admin Category Management</h1>

        <div className="mb-8">
          <h2 className="text-2xl mb-4">Add New Category</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category Name"
              className="p-2 bg-gray-200 text-black rounded"
            />
            <input
              type="text"
              value={newOffer}
              onChange={(e) => setNewOffer(e.target.value)}
              placeholder="Offer Description (Optional)"
              className="p-2 bg-gray-200 text-black rounded"
            />
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:opacity-75"
              onClick={handleAddCategory}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Category"}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-teal-600">
              <tr>
                <th className="p-4 border-b">Si.No</th>
                <th className="p-4 border-b">Category Name</th>
                <th className="p-4 border-b">Blocked</th>
                <th className="p-4 border-b">Offer</th>
                <th className="p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCategories.map((category, index) => (
                <tr key={category._id} className="bg-[#234] hover:bg-teal-700">
                  <td className="p-4 border-b">{index + 1}</td>
                  <td className="p-4 border-b">
                    {editingCategoryId === category._id ? (
                      <input
                        type="text"
                        value={editingCategory}
                        onChange={(e) => setEditingCategory(e.target.value)}
                        className="p-2 bg-gray-200 text-black rounded"
                      />
                    ) : (
                      category.Category
                    )}
                  </td>
                  <td className="p-4 border-b">{category.isBlocked ? "Yes" : "No"}</td>
                  <td className="p-4 border-b">
                    {editingCategoryId === category._id ? (
                      <input
                        type="text"
                        value={editingOffer}
                        onChange={(e) => setEditingOffer(e.target.value)}
                        className="p-2 bg-gray-200 text-black rounded"
                      />
                    ) : (
                      category.Offer
                    )}
                  </td>
                  <td className="p-4 border-b flex gap-2">
                    {editingCategoryId === category._id ? (
                      <button
                        className="px-4 py-2 bg-green-600 rounded hover:opacity-75"
                        onClick={() => handleSaveCategory(category._id)}
                      >
                        Save
                      </button>
                    ) : (
                      <>
                        <button
                          className={`px-4 py-2 rounded text-white ${
                            category.isBlocked ? "bg-red-600" : "bg-green-600"
                          } hover:opacity-75`}
                          onClick={() => handleToggleBlock(category._id, category.isBlocked)}
                        >
                          {category.isBlocked ? "Unblock" : "Block"}
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-600 rounded hover:opacity-75"
                          onClick={() => handleEditCategory(category)}
                        >
                          Edit
                        </button>

                        <button
                          className="px-4 py-2 bg-red-600 rounded hover:opacity-75"
                          onClick={() => handleRemoveCategory(category._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            totalItems={categories.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default AdminSideCategoryPage;