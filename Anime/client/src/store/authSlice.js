import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('hikari_token');
const userJson = localStorage.getItem('hikari_user');

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
      localStorage.setItem('hikari_token', action.payload.token);
      localStorage.setItem('hikari_user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loginDrawerOpen = false;
      state.error = null;
      localStorage.removeItem('hikari_token');
      localStorage.removeItem('hikari_user');
      localStorage.removeItem('hikari_cart');
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
