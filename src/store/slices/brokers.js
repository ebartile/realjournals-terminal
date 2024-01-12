import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { route, thunkRequest } from 'services/Http';

export const brokersState = {
  brokers: {
    error: null,
    loading: false,
    data: []
  }
};

export const fetchBrokers = createAsyncThunk('brokers/fetch', (arg, api) => {
  return thunkRequest(api).get(route('brokers.get'));
});

const brokers = createSlice({
  name: 'brokers',
  initialState: brokersState,
  reducers: {
    resetBrokers: (state, action) => {
      return brokersState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrokers.pending, (state) => {
        return {
          ...state.brokers,
          error: null,
          loading: true
        };
      })
      .addCase(fetchBrokers.rejected, (state, action) => {
        return {
          ...state.brokers,
          error: action.error.message, // Corrected error message handling
          loading: false
        };
      })
      .addCase(fetchBrokers.fulfilled, (state, action) => {
        return {
          ...state.brokers,
          error: null,
          data: action.payload,
          loading: false
        };
      });
  }
});

export const { resetBrokers } = brokers.actions;

export default brokers.reducer;
