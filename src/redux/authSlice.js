// redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    formData: {
      fullname: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    errorMessage: '',
    successMessage: '',
  },
  reducers: {
    setFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    clearMessages: (state) => {
      state.errorMessage = '';
      state.successMessage = '';
    }, login: (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      },
      logout: (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      },
  },
});

export const {
  setFormData,
  setErrorMessage,
  setSuccessMessage,
  clearMessages,
} = authSlice.actions;

export default authSlice.reducer;
