import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { route, thunkRequest } from 'services/Http';

export const accountState = {
  activeAccount: null,
  activeAccountHistoryDeals: {
    count: 0,
    error: null,
    data: [],
    loading: false
  },
  activeAccountHistoryOrders: {
    count: 0,
    error: null,
    data: [],
    loading: false
  },
  activeAccountPositionOrders: {
    count: 0,
    error: null,
    data: [],
    loading: false
  },
  activeAccountOrders: {
    count: 0,
    error: null,
    data: [],
    loading: false
  },
  accounts: {
    count: 0,
    error: null,
    loading: false,
    data: []
  }
};

// TODO: add member parameter
export const fetchAccounts = createAsyncThunk('accounts/fetchAccounts', (arg, api) => {
  return thunkRequest(api).get(route('accounts.get'));
});

export const fetchAccount = createAsyncThunk('accounts/fetchAccount', (arg, api) => {
  return thunkRequest(api).get(route('accounts.get', { id: arg }));
});

export const fetchHistoryDeals = createAsyncThunk('accounts/fetchHistoryDeals', (arg, api) => {
  const fullUrl = `${route('accounts.history_deals_get', arg['id'])}?${arg['queryParams']}`;
  return thunkRequest(api).get(fullUrl);
});

export const fetchHistoryOrders = createAsyncThunk('accounts/fetchHistoryOrders', (arg, api) => {
  const fullUrl = `${route('accounts.history_orders_get', arg['id'])}?${arg['queryParams']}`;
  return thunkRequest(api).get(fullUrl);
});

export const fetchPositionsOrders = createAsyncThunk('accounts/fetchPositionsOrders', (arg, api) => {
  const fullUrl = `${route('accounts.positions_get', arg['id'])}?${arg['queryParams']}`;
  return thunkRequest(api).get(fullUrl);
});

export const fetchOrders = createAsyncThunk('accounts/fetchOrders', (arg, api) => {
  const fullUrl = `${route('accounts.orders_get', arg['id'])}?${arg['queryParams']}`;
  return thunkRequest(api).get(fullUrl);
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
        count: action.payload.count,
        error: null,
        data: action.payload.results,
        loading: false
      };
    },
    [fetchHistoryDeals.pending]: (state) => {
      state.activeAccountHistoryDeals = {
        ...state.activeAccountHistoryDeals,
        error: null,
        loading: true
      };
    },
    [fetchHistoryDeals.rejected]: (state, action) => {
      state.activeAccountHistoryDeals = {
        ...state.activeAccountHistoryDeals,
        error: action.error._error_message,
        loading: false
      };
    },
    [fetchHistoryDeals.fulfilled]: (state, action) => {
      state.activeAccountHistoryDeals = {
        ...state.activeAccountHistoryDeals,
        count: action.payload.count,
        error: null,
        data: action.payload.results,
        loading: false
      };
    },
    [fetchHistoryOrders.pending]: (state) => {
      state.activeAccountHistoryOrders = {
        ...state.activeAccountHistoryOrders,
        error: null,
        loading: true
      };
    },
    [fetchHistoryOrders.rejected]: (state, action) => {
      state.activeAccountHistoryOrders = {
        ...state.activeAccountHistoryOrders,
        error: action.error._error_message,
        loading: false
      };
    },
    [fetchHistoryOrders.fulfilled]: (state, action) => {
      state.activeAccountHistoryOrders = {
        ...state.activeAccountHistoryOrders,
        count: action.payload.count,
        error: null,
        data: action.payload.results,
        loading: false
      };
    },
    [fetchPositionsOrders.pending]: (state) => {
      state.activeAccountPositionOrders = {
        ...state.activeAccountPositionOrders,
        error: null,
        loading: true
      };
    },
    [fetchPositionsOrders.rejected]: (state, action) => {
      state.activeAccountPositionOrders = {
        ...state.activeAccountPositionOrders,
        error: action.error._error_message,
        loading: false
      };
    },
    [fetchPositionsOrders.fulfilled]: (state, action) => {
      state.activeAccountPositionOrders = {
        ...state.activeAccountPositionOrders,
        count: action.payload.count,
        error: null,
        data: action.payload.results,
        loading: false
      };
    },
    [fetchOrders.pending]: (state) => {
      state.activeAccountOrders = {
        ...state.activeAccountOrders,
        error: null,
        loading: true
      };
    },
    [fetchOrders.rejected]: (state, action) => {
      state.activeAccountOrders = {
        ...state.activeAccountOrders,
        error: action.error._error_message,
        loading: false
      };
    },
    [fetchOrders.fulfilled]: (state, action) => {
      state.activeAccountOrders = {
        ...state.activeAccountOrders,
        count: action.payload.count,
        error: null,
        data: action.payload.results,
        loading: false
      };
    }
  }
});

export const { setActiveAccount } = account.actions;

export default account.reducer;
