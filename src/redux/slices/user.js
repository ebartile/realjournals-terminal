import { route, thunkRequest } from 'services/Http';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const userState = {
  users: []
};

export const FetchUsers = createAsyncThunk('users/FetchUsers', (arg, api) => {
  return thunkRequest(api).get(route('user.get-users'));
});

const user = createSlice({
  name: 'user',
  initialState: userState,
  extraReducers: {
    [FetchUsers.pending]: (state) => {
      state.users = {
        ...state.users,
        error: null,
        loading: true
      };
    },
    [FetchUsers.rejected]: (state, action) => {
      state.users = {
        ...state.users,
        error: action.error._error_message,
        loading: false
      };
    },
    [FetchUsers.fulfilled]: (state, action) => {
      state.users = {
        ...state.users,
        error: null,
        data: action.payload,
        loading: false
      };
    }
  }
});

export default user.reducer;
