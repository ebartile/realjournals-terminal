import { createSlice } from '@reduxjs/toolkit';

export const userState = {};

const user = createSlice({
  name: 'user',
  initialState: userState,
  extraReducers: {}
});

export default user.reducer;
