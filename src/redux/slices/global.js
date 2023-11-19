import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { route, thunkRequest } from 'services/Http';

export const globalState = {
  testimonials: {
    error: null,
    loading: false,
    data: []
  },
  brokers: {
    error: null,
    loading: false,
    data: []
  }
};

export const fetchTestimonials = createAsyncThunk('testimonials/fetch', (arg, api) => {
  return thunkRequest(api).get(route('testimonials.get'));
});

export const fetchBrokers = createAsyncThunk('brokers/fetch', (arg, api) => {
  return thunkRequest(api).get(route('brokers.get'));
});

const global = createSlice({
  name: 'global',
  initialState: globalState,
  extraReducers: {
    [fetchTestimonials.pending]: (state) => {
      state.testimonials = {
        ...state.testimonials,
        error: null,
        loading: true
      };
    },
    [fetchTestimonials.rejected]: (state, action) => {
      state.testimonials = {
        ...state.testimonials,
        error: action.error._error_message,
        loading: false
      };
    },
    [fetchTestimonials.fulfilled]: (state, action) => {
      state.testimonials = {
        ...state.testimonials,
        error: null,
        data: action.payload,
        loading: false
      };
    },
    [fetchBrokers.pending]: (state) => {
      state.brokers = {
        ...state.brokers,
        error: null,
        loading: true
      };
    },
    [fetchBrokers.rejected]: (state, action) => {
      state.testimonials = {
        ...state.brokers,
        error: action.error._error_message,
        loading: false
      };
    },
    [fetchBrokers.fulfilled]: (state, action) => {
      state.brokers = {
        ...state.brokers,
        error: null,
        data: action.payload,
        loading: false
      };
    }
  }
});

// export const {
//
// } = global.actions;

export default global.reducer;
