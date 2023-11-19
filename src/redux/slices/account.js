import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { route, thunkRequest } from 'services/Http';

export const accountState = {
  activeAccount: null,
  accounts: {
    error: null,
    loading: false,
    data: []
  }
};

// TODO: add member parameter
export const fetchAccounts = createAsyncThunk('accounts/fetchAccounts', (arg, api) => {
  return thunkRequest(api).get(route('accounts.get'));
});

const account = createSlice({
  name: 'account',
  initialState: accountState,
  reducers: {
    setActiveAccount: (state, action) => {
      state.activeAccount = action.payload;
    }
  },
  extraReducers: {
    // Fetch Accounts
    [fetchAccounts.pending]: (state) => {
      state.accounts = {
        ...state.accounts,
        error: null,
        loading: true
      };
    },
    [fetchAccounts.rejected]: (state, action) => {
      state.accounts = {
        ...state.accounts,
        error: action.error._error_message,
        loading: false
      };
    },
    [fetchAccounts.fulfilled]: (state, action) => {
      state.accounts = {
        ...state.accounts,
        error: null,
        data: action.payload,
        loading: false
      };
    }
  }
});

export const { setActiveAccount } = account.actions;

export default account.reducer;
