import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { route, thunkRequest } from 'services/Http';

export const globalState = {
  subscription: 'professional',
  isMonthly: false,
  access_token: null,
  auth_token: null,
  refresh_token: null
};

const global = createSlice({
  name: 'global',
  initialState: globalState,
  reducers: {
    resetGlobal: (state, action) => {
      return globalState;
    },
    resetTokens: (state, action) => {
      state.access_token = null;
      state.refresh_token = null;
      state.auth_token = null;
      return state;
    },
    setAuthToken: (state, action) => {
      state.auth_token = action.payload;
      return state;
    },
    setAccessToken: (state, action) => {
      state.access_token = action.payload;
      return state;
    },
    setRefreshToken: (state, action) => {
      state.refresh_token = action.payload;
      return state;
    },
    setSubscription: (state, action) => {
      state.subscription = action.payload;
      return state;
    },
    setIsMonthly: (state, action) => {
      state.isMonthly = action.payload;
      return state;
    }
  },
  extraReducers: (builder) => {}
});

export const {
  resetGlobal,
  resetTokens,
  setAccessToken,
  setAuthToken,
  setRefreshToken,
  setSubscription,
  setIsMonthly
} = global.actions;

export default global.reducer;
