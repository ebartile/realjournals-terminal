import React, { useEffect } from 'react';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { route, thunkRequest } from 'services/Http';
import { assign } from 'lodash';
import context from 'context';

export const authState = {
  user: null,
  credential: 'email',
  userSetup: false,
  error: null,
  loading: false
};

export const initAuthState = () => {
  return assign({}, authState, { credential: 'email' });
};

export const fetchUser = createAsyncThunk('auth/fetchUser', (arg, api) => {
  return thunkRequest(api).get(route('users.me'));
});

export const LogoutUser = createAsyncThunk('auth/LogoutUser', (arg, api) => {
  return thunkRequest(api).get(route('auth.logout'));
});

export const UpdateUser = createAsyncThunk('users/UpdateUser', (arg, api) => {
  return thunkRequest(api).put(route('users.update', { id: arg['id'] }));
});

const auth = createSlice({
  name: 'auth',
  initialState: authState,
  reducers: {
    resetAuth: (state, action) => {
      return authState;
    },
    setUser(state, action) {
      state.user = action.payload;
      return state;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        return {
          ...state,
          error: null,
          loading: true
        };
      })
      .addCase(fetchUser.rejected, (state, action) => {
        return {
          ...state,
          error: action.error.message,
          loading: false
        };
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        return {
          ...state,
          error: null,
          user: action.payload,
          loading: false
        };
      })
      .addCase(LogoutUser.pending, (state) => {
        return {
          ...state,
          error: null,
          loading: true
        };
      })
      .addCase(LogoutUser.rejected, (state, action) => {
        return {
          ...state,
          error: action.error.message,
          loading: false
        };
      })
      .addCase(LogoutUser.fulfilled, (state, action) => {
        return {
          ...state,
          user: null,
          error: null,
          loading: false
        };
      })
      .addCase(UpdateUser.pending, (state) => {
        return {
          ...state,
          error: null,
          loading: true
        };
      })
      .addCase(UpdateUser.rejected, (state, action) => {
        return {
          ...state,
          error: action.error.message,
          loading: false
        };
      })
      .addCase(UpdateUser.fulfilled, (state, action) => {
        return {
          ...state,
          error: null,
          user: action.payload,
          loading: false
        };
      });
  }
});

export const { resetAuth, setUser } = auth.actions;

export default auth.reducer;
