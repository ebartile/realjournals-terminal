import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { route, thunkRequest } from 'services/Http';

export const accountState = {
  activeAccount: null,
  dates: {
    start_date: new Date(new Date().setDate(new Date().getDate() - 365)).toISOString(),
    end_date: new Date().toISOString()
  },
  activeAccountStats: {
    error: null,
    data: {
      total_trades: 0,
      total_winning_trades: 0,
      total_lossing_trades: 0,
      net_profit: 0,
      net_loss: 0,
      net_profit_loss_data: [],
      net_profit_loss_labels: [],
      trade_allocation_amounts: [],
      trade_allocation_categories: [],
      fees_paid: 10,
      total_deposits: 40,
      total_withdrawals: 20,
      total_trades_return_in_currency: -10,
      average_return_per_trade_in_currency: -10,
      average_return_per_trade_in_percentage: -10,
      winning_rate: 10
    },
    loading: false
  },
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

export const fetchAccountStats = createAsyncThunk('accounts/fetchAccountStats', (arg, api) => {
  const fullUrl = `${route('account.get.stats', arg['id'])}?${arg['queryParams']}`;
  return thunkRequest(api).get(fullUrl);
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
    resetAccount: (state, action) => {
      return accountState;
    },
    addAccount: (state, action) => {
      state.accounts.data = [...state.accounts.data, action.payload];
      state.accounts.count = state.accounts.count + 1;
      return state;
    },
    setActiveAccount: (state, action) => {
      state.activeAccount = action.payload;
      return state;
    },
    setStartDate: (state, action) => {
      state.dates.start_date = action.payload;
      return state;
    },
    setEndDate: (state, action) => {
      state.dates.end_date = action.payload;
      return state;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        return {
          ...state,
          accounts: {
            ...state.accounts,
            error: null,
            loading: true
          }
        };
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        return {
          ...state,
          accounts: {
            ...state.accounts,
            error: action.error.message,
            loading: true
          }
        };
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        return {
          ...state,
          accounts: {
            ...state.accounts,
            count: action.payload.count,
            data: action.payload.results,
            error: null,
            loading: false
          }
        };
      })
      .addCase(fetchAccountStats.pending, (state) => {
        return {
          ...state,
          activeAccountStats: {
            ...state.activeAccountStats,
            error: null,
            loading: true
          }
        };
      })
      .addCase(fetchAccountStats.rejected, (state, action) => {
        return {
          ...state,
          activeAccountStats: {
            ...state.activeAccountStats,
            error: action.error.message,
            loading: true
          }
        };
      })
      .addCase(fetchAccountStats.fulfilled, (state, action) => {
        return {
          ...state,
          activeAccountStats: {
            ...state.activeAccountStats,
            data: action.payload,
            error: null,
            loading: false
          }
        };
      })
      .addCase(fetchHistoryDeals.pending, (state) => {
        return {
          ...state,
          activeAccountHistoryDeals: {
            ...state.activeAccountHistoryDeals,
            error: null,
            loading: true
          }
        };
      })
      .addCase(fetchHistoryDeals.rejected, (state, action) => {
        return {
          ...state,
          activeAccountHistoryDeals: {
            ...state.activeAccountHistoryDeals,
            error: action.error.message,
            loading: false
          }
        };
      })
      .addCase(fetchHistoryDeals.fulfilled, (state, action) => {
        return {
          ...state,
          activeAccountHistoryDeals: {
            ...state.activeAccountHistoryDeals,
            count: action.payload.count,
            error: null,
            data: action.payload.results,
            loading: false
          }
        };
      })
      .addCase(fetchHistoryOrders.pending, (state) => {
        return {
          ...state,
          activeAccountHistoryOrders: {
            ...state.activeAccountHistoryOrders,
            error: null,
            loading: true
          }
        };
      })
      .addCase(fetchHistoryOrders.rejected, (state, action) => {
        return {
          ...state,
          activeAccountHistoryOrders: {
            ...state.activeAccountHistoryOrders,
            error: action.error.message,
            loading: false
          }
        };
      })
      .addCase(fetchHistoryOrders.fulfilled, (state, action) => {
        return {
          ...state,
          activeAccountHistoryOrders: {
            ...state.activeAccountHistoryOrders,
            count: action.payload.count,
            error: null,
            data: action.payload.results,
            loading: false
          }
        };
      })

      // Cases for fetchPositionsOrders and fetchOrders similarly
      .addCase(fetchPositionsOrders.pending, (state) => {
        return {
          ...state,
          activeAccountPositionOrders: {
            ...state.activeAccountPositionOrders,
            error: null,
            loading: true
          }
        };
      })
      .addCase(fetchPositionsOrders.rejected, (state, action) => {
        return {
          ...state,
          activeAccountPositionOrders: {
            ...state.activeAccountPositionOrders,
            error: action.error.message,
            loading: false
          }
        };
      })
      .addCase(fetchPositionsOrders.fulfilled, (state, action) => {
        return {
          ...state,
          activeAccountPositionOrders: {
            ...state.activeAccountPositionOrders,
            count: action.payload.count,
            error: null,
            data: action.payload.results,
            loading: false
          }
        };
      })

      .addCase(fetchOrders.pending, (state) => {
        return {
          ...state,
          activeAccountOrders: {
            ...state.activeAccountOrders,
            error: null,
            loading: true
          }
        };
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        return {
          ...state,
          activeAccountOrders: {
            ...state.activeAccountOrders,
            error: action.error.message,
            loading: false
          }
        };
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        return {
          ...state,
          activeAccountOrders: {
            ...state.activeAccountOrders,
            count: action.payload.count,
            error: null,
            data: action.payload.results,
            loading: false
          }
        };
      });
  }
});

export const { resetAccount, addAccount, setActiveAccount, setEndDate, setStartDate } = account.actions;

export default account.reducer;
