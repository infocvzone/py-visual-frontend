import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  token: null,
  user: null,
  isAdmin: false, // Added to track admin state separately
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    Adminlogin: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAdmin = true;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('isAdmin', true);
    },
    Adminlogout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.isAdmin = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAdmin');
    },
    Userlogin: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAdmin = false;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('isAdmin', false);
    },
    Userlogout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.isAdmin = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAdmin');
    },

    loadToken: (state) => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      if (token && user) {
        state.isAuthenticated = true;
        state.token = token;
        state.user = user;
        state.isAdmin = isAdmin;
      }
    },
  },
});

export const { Adminlogin, Adminlogout, Userlogin, Userlogout, loadToken } = authSlice.actions;

export default authSlice.reducer;