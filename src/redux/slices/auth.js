import React, { useEffect } from 'react';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { route, thunkRequest } from 'services/Http';
import { assign } from 'lodash';
import context from 'context';

export const authState = {
  user: null,
  credential: 'email',
  userSetup: false
};

export const initAuthState = () => {
  return assign({}, authState, context.auth);
};

export const fetchUser = createAsyncThunk('auth/fetchUser', (arg, api) => {
  return thunkRequest(api).get(route('users.me'));
});

export const LogoutUser = createAsyncThunk('auth/logout', (arg, api) => {
  return thunkRequest(api).get(route('auth.logout'));
});

const auth = createSlice({
  name: 'auth',
  initialState: authState,
  extraReducers: {
    [fetchUser.fulfilled]: (state, action) => {
      state.user = action.payload;
    },
    [LogoutUser.fulfilled]: (state, action) => {
      state.user = null;
    }
  }
});

export default auth.reducer;
