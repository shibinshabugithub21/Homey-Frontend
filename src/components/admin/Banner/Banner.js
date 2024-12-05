'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Lock, Unlock } from 'lucide-react';

export default function BannerDashboard() {
  const [banners, setBanners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    bannername: '',
    icon: null,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/getBanner`);
        setBanners(response.data);
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };
    fetchBanners();
  }, []);

  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle file input changes (for the icon)
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, icon: e.target.files[0] }));
  };

  // Handle adding a new banner
  const handleAddBanner = async () => {
    const newFormData = new FormData();
    newFormData.append('bannername', formData.bannername);
    newFormData.append('icon', formData.icon);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_Backend_Port}/admin/addBanner`,
        newFormData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setBanners((prev) => [...prev, response.data]); // Add the new banner to the list
      setShowModal(false); // Close the modal
      setFormData({ bannername: '', icon: null }); // Reset form data
    } catch (error) {
      setError('Failed to add banner. Please check the form data.');
    }
  };

  // Handle deleting a banner
  const handleDelete = (id) => {
    setBanners((prev) => prev.filter((banner) => banner._id !== id));
    // Also delete from backend
    axios.delete(`${process.env.NEXT_PUBLIC.Backend_Port}/admin/deleteBanner/${id}`);
  };

const handleToggleBannerStatus = async (id) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_Backend_Port}/admin/blockBanner/${id}`
      );
      alert(response.data.message); // Display success message from the backend
      setBanners((prev) =>
        prev.map((banner) =>
          banner._id === id ? { ...banner, isBlocked: !banner.isBlocked } : banner
        )
      ); // Update the UI to reflect the new status
    } catch (error) {
      console.error('Error toggling banner status:', error);
      alert('Failed to toggle banner status.');
    }
  };
  
  
  

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-6">
        {/* Add Banner Button */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 mb-6"
        >
          Add New Banner
        </button>
        <div className="flex space-x-6 overflow-x-auto">
  {banners.map((banner) => (
    <div key={banner._id} className="flex flex-col space-y-4 w-64">
      {/* Banner Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="h-48 w-full flex items-center justify-center bg-gray-200">
          {banner.isBlocked ? (
            <div className="text-gray-500">This banner is blocked</div>
          ) : (
            banner.icon && (
              <img
                src={banner.icon}
                alt={banner.bannername}
                className="w-full h-full object-contain"
              />
            )
          )}
        </div>
      </div>

      {/* Banner Details */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="text-xl font-bold mb-2">{banner.bannername}</h3>
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              banner.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {banner.status}
          </span>
        </div>
      </div>

      {/* Banner Actions */}
      <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col space-y-4">
        <button
          onClick={() => handleDelete(banner._id)}
          className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 flex items-center justify-center"
        >
          <Trash2 className="mr-2" size={16} />
          Delete
        </button>

        <button
          onClick={() => handleToggleBannerStatus(banner._id)}
          className={`text-${banner.isBlocked ? 'green' : 'red'}-500`}
        >
          {banner.isBlocked ? 'Unblock' : 'Block'}
        </button>
      </div>
    </div>
  ))}
</div>

      </div>

      {/* Add Banner Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h3 className="text-2xl font-bold mb-4">Add Banner</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddBanner();
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700">Banner Name</label>
                <input
                  type="text"
                  name="bannername"
                  value={formData.bannername}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter banner name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Icon (Image)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
              >
                Add Banner
              </button>
            </form>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
