import axiosInstance from "@/utils/axiosInstances";

// Fetch all subscriptions
export const fetchSubscriptions = async () => {
    return axiosInstance.get("/admin/getPlans");
  };
  
  // Add a subscription
  export const addSubscription = async (data) => {
    return axiosInstance.post("/admin/addPlans", data);
  };
  
  // Edit a subscription
  export const editSubscription = async (id, data) => {
    return axiosInstance.put(`/admin/editPlans/${id}`, data);
  };
  
  // Delete a subscription
  export const deleteSubscription = async (id) => {
    return axiosInstance.delete(`/admin/delete/${id}`);
  };
  
  // Block/Unblock a subscription
  export const blockSubscription = async (id) => {
    return axiosInstance.post(`/admin/blockPlans/${id}`);
  };

