import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('formora_token');
const userJson = localStorage.getItem('formora_user');

const initialState = {
  user: userJson ? JSON.parse(userJson) : null,
  token: token || null,
  isAuthenticated: !!token,
  loginDrawerOpen: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loginDrawerOpen = false;
      state.error = null;
      localStorage.setItem('formora_token', action.payload.token);
      localStorage.setItem('formora_user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loginDrawerOpen = false;
      state.error = null;
      localStorage.removeItem('formora_token');
      localStorage.removeItem('formora_user');
      localStorage.removeItem('formora_cart');
    },
    setLoginDrawerOpen: (state, action) => {
      state.loginDrawerOpen = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { loginSuccess, logout, setLoginDrawerOpen, setError } = authSlice.actions;
export default authSlice.reducer;
