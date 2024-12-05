import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function OfferManagement() {
  const [offers, setOffers] = useState([]);
  const [newOffer, setNewOffer] = useState({ title: "", details: "" });
  const [editingOffer, setEditingOffer] = useState(null); // Track the offer being edited

  // Fetch offers when the component mounts
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/getOffers`);
        setOffers(response.data);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };
    fetchOffers();
  }, []);

  // Add a new offer
  const handleAddOffer = async () => {
    if (!newOffer.title || !newOffer.details) {
      alert("Both title and details are required.");
      return;
    }
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/addOffer`, newOffer);
      setOffers([...offers, response.data]); // Add the new offer to the list
      setNewOffer({ title: "", details: "" }); // Reset the form
    } catch (error) {
      console.error("Error adding offer:", error.response?.data || error);
      alert("Failed to add offer.");
    }
  };

  // Delete an offer
  const handleDeleteOffer = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/deleteOffer/${id}`);
      setOffers((prev) => prev.filter((offer) => offer._id !== id)); // Remove the deleted offer
    } catch (error) {
      console.error("Error deleting offer:", error.response?.data || error);
      alert("Failed to delete offer.");
    }
  };

  // Start editing an offer
  const handleEditOffer = (offer) => {
    setEditingOffer(offer);
  };

  // Update an offer
  const handleUpdateOffer = async () => {
    if (!editingOffer.title || !editingOffer.details) {
      alert("Both title and details are required.");
      return;
    }
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_Backend_Port}/admin/updateOffer/${editingOffer._id}`,
        editingOffer
      );
      setOffers((prev) => prev.map((offer) => (offer._id === editingOffer._id ? response.data : offer))); // Update the offer in the state
      setEditingOffer(null); // Exit editing mode
    } catch (error) {
      console.error("Error updating offer:", error.response?.data || error);
      alert("Failed to update offer.");
    }
  };

  const handleToggleOffer = async (offerId) => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_Backend_Port}/admin/blockOffer/${offerId}`);
      const updatedOffer = response.data.offer;

      // Update the state with the updated offer status
      setOffers((prevOffers) => prevOffers.map((offer) => (offer._id === updatedOffer._id ? updatedOffer : offer)));
    } catch (error) {
      console.error("Error toggling offer status:", error);
      alert("Failed to toggle offer status.");
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Offer Management</h1>

      {/* Add Offer Form */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Add New Offer</h2>
        <input
          type="text"
          placeholder="Offer Title"
          value={newOffer.title}
          onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
          className="block w-full mb-2 px-4 py-2 border rounded-md"
        />
        <textarea
          placeholder="Offer Details"
          value={newOffer.details}
          onChange={(e) => setNewOffer({ ...newOffer, details: e.target.value })}
          className="block w-full mb-2 px-4 py-2 border rounded-md"
        />
        <button onClick={handleAddOffer} className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600">
          Add Offer
        </button>
      </div>

      {/* Offer List */}
      <h2 className="text-lg font-semibold mb-2">Existing Offers</h2>
      <ul className="space-y-4">
        {offers.map((offer) => (
          <li key={offer._id} className="p-4 bg-white rounded-lg shadow-md">
            {editingOffer && editingOffer._id === offer._id ? (
              <div>
                <input
                  type="text"
                  value={editingOffer.title}
                  onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                  className="block w-full mb-2 px-4 py-2 border rounded-md"
                />
                <textarea
                  value={editingOffer.details}
                  onChange={(e) => setEditingOffer({ ...editingOffer, details: e.target.value })}
                  className="block w-full mb-2 px-4 py-2 border rounded-md"
                />
                <button
                  onClick={handleUpdateOffer}
                  className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingOffer(null)}
                  className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold">{offer.title}</h3>
                <p>{offer.details}</p>
                <div className="mt-4 space-x-2">
                  <button
                    onClick={() => handleEditOffer(offer)}
                    className="bg-yellow-500 text-white py-2 px-6 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteOffer(offer._id)}
                    className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                  {/* Block/Unblock Button */}
                  <button
                    onClick={() => handleToggleOffer(offer._id)}
                    className={`px-4 py-2 rounded-lg text-white ${
                      offer.status === "active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {offer.status === "active" ? (
                      <span>Block Offer</span> // Button for unblocking
                    ) : (
                      <span>Unblock Offer</span> // Button for blocking
                    )}
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
