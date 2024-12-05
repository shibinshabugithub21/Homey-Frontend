// redux/serviceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks for API calls
export const fetchServices = createAsyncThunk('worker/fetchServices', async () => {
  const response = await axios.get('/admin/services');
  return response.data;
});

export const addService = createAsyncThunk('services/addService', async (newService) => {
  const formData = new FormData();
  formData.append('name', newService.name);
  formData.append('description', newService.description);
  formData.append('category', newService.category);
  formData.append('price', newService.price);
  formData.append('icon', newService.icon);

  const response = await axios.post('/admin/services', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
});

export const deleteService = createAsyncThunk('services/deleteService', async (id) => {
  await axios.delete(`/admin/services/${id}`);
  return id;
});

const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    services: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addService.fulfilled, (state, action) => {
        state.services.push(action.payload);
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter((service) => service._id !== action.payload);
      });
  },
});

export default serviceSlice.reducer;
