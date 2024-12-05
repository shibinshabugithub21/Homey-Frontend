"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2"; 
import Pagination from "./pagination";
const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/getUsers`);
        if (response.status === 200) {
          setUsers(response.data);
        } else {
          toast.error("Error fetching users: " + response.data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error fetching data: " + (error.response ? error.response.data.message : error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleBlock = async (id, isBlocked) => {
    const action = isBlocked ? "unblock" : "block";
    const result = await Swal.fire({
      title: `Are you sure you want to ${action} this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/blockUser/${id}`);
        if (response.data.success) {
          setUsers((prevUsers) =>
            prevUsers.map((user) => (user._id === id ? response.data.data : user))
          );
          toast.success("User status updated successfully!");
        } else {
          toast.error("Error updating user status: " + response.data.message);
        }
      } catch (error) {
        console.error("Error updating user status:", error);
        toast.error("Error updating user status: " + (error.response ? error.response.data.message : error.message));
      }
    }
  };

  // Calculate users to display on the current page
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="flex h-screen bg-[#123] text-white">
      <main className="ml-64 p-8 w-full">
        <h1 className="text-4xl mb-6">User Management</h1>
        {loading ? (
          <p>Loading...</p> 
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left border-collapse">
              <thead className="bg-teal-600">
                <tr>
                  <th className="p-4 border-b">Si.No</th>
                  <th className="p-4 border-b">User ID</th>
                  <th className="p-4 border-b">Username</th>
                  <th className="p-4 border-b">Phone</th>
                  <th className="p-4 border-b">Email</th>
                  <th className="p-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={user._id} className="bg-[#234] hover:bg-teal-700">
                    <td className="p-4 border-b">{index + indexOfFirstUser + 1}</td>
                    <td className="p-4 border-b">{user._id}</td>
                    <td className="p-4 border-b">{user.fullname}</td>
                    <td className="p-4 border-b">{user.phone}</td>
                    <td className="p-4 border-b">{user.email}</td>
                    <td className="p-4 border-b flex gap-2">
                      <button
                        className={`px-4 py-2 rounded text-white ${
                          user.isBlocked ? "bg-red-600" : "bg-green-600"
                        } hover:opacity-75`}
                        onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              totalItems={users.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage} 
            />
          </div>
        )}
      </main>
      <ToastContainer />
    </div>
  );
};

export default UserManagementPage;
