import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { map, filter } from 'lodash';
import { useActiveAccount } from 'hooks/account';
import { route, thunkRequest } from 'services/Http';

// ----------------------------------------------------------------------

export const calendarState = {
  calendar: {
    error: null,
    loading: false,
    data: []
  },
  isOpenModal: false,
  selectedEventId: null,
  selectedRange: null
};

export const getEvents = createAsyncThunk('account/getEvents', (arg, api) => {
  const activeAccount = useActiveAccount();
  return thunkRequest(api).get(route('terminal.account.events', { id: activeAccount.id }));
});

export const updateEvent = createAsyncThunk('account/updateEvent', (updateEvent, api) => {
  const activeAccount = useActiveAccount();
  return thunkRequest(api).patch(
    route('terminal.account.events.details', { id: activeAccount.id, pk: newEvent.id }),
    updateEvent
  );
});

export const deleteEvent = createAsyncThunk('account/deleteEvent', (updateEvent, api) => {
  const activeAccount = useActiveAccount();
  return thunkRequest(api).delete(
    route('terminal.account.events.details', { id: activeAccount.id, pk: newEvent.id }),
    updateEvent
  );
});

// ----------------------------------------------------------------------

const calendar = createSlice({
  name: 'calendar',
  initialState: calendarState,
  reducers: {
    // SELECT EVENT
    selectEvent(state, action) {
      const eventId = action.payload;
      state.isOpenModal = true;
      state.selectedEventId = eventId;
    },

    // SELECT RANGE
    selectRange(state, action) {
      const { start, end } = action.payload;
      state.isOpenModal = true;
      state.selectedRange = { start, end };
    },

    // OPEN MODAL
    openModal(state) {
      state.isOpenModal = true;
    },

    // CLOSE MODAL
    closeModal(state) {
      state.isOpenModal = false;
      state.selectedEventId = null;
      state.selectedRange = null;
    }
  },
  extraReducers: {
    [getEvents.pending]: (state) => {
      state.calendar = {
        ...state.calendar,
        error: null,
        loading: true
      };
    },
    [getEvents.rejected]: (state, action) => {
      state.calendar = {
        ...state.calendar,
        error: action.error.message,
        loading: false
      };
    },
    [getEvents.fulfilled]: (state, action) => {
      state.calendar = {
        ...state.calendar,
        error: null,
        data: action.payload,
        loading: false
      };
    },
    [updateEvent.pending]: (state) => {
      state.calendar = {
        ...state.calendar,
        error: null,
        loading: true
      };
    },
    [updateEvent.rejected]: (state, action) => {
      state.calendar = {
        ...state.calendar,
        error: action.error.message,
        loading: false
      };
    },
    [updateEvent.fulfilled]: (state, action) => {
      const updateEvent = map(state.data, (_event) => {
        if (_event.id === action.payload.id) {
          return action.payload;
        }
        return _event;
      });
      state.calendar = {
        ...state.calendar,
        error: null,
        data: updateEvent,
        loading: false
      };
    },
    [deleteEvent.pending]: (state) => {
      state.calendar = {
        ...state.calendar,
        error: null,
        loading: true
      };
    },
    [deleteEvent.rejected]: (state, action) => {
      state.calendar = {
        ...state.calendar,
        error: action.error.message,
        loading: false
      };
    },
    [deleteEvent.fulfilled]: (state, action) => {
      const deleteEvent = filter(state.calendar.data, (event) => event.id !== action.payload.id);
      state.calendar = {
        ...state.calendar,
        error: null,
        data: deleteEvent,
        loading: false
      };
    }
  }
});

// Reducer
export default calendar.reducer;

// Actions
export const { openModal, closeModal, selectEvent } = calendar.actions;

export const selectRange = (start, end) => {
  return async (dispatch) => {
    dispatch(
      calendar.actions.selectRange({
        start: start.getTime(),
        end: end.getTime()
      })
    );
  };
};
