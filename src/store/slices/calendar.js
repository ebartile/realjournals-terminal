import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { map, filter } from 'lodash';
import { route, thunkRequest } from 'services/Http';

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

export const getEvents = createAsyncThunk('calendar/getEvents', (arg, api) => {
  return thunkRequest(api).get(route('account.events', { id: arg }));
});

const calendar = createSlice({
  name: 'calendar',
  initialState: calendarState,
  reducers: {
    resetCalendar: (state, action) => {
      return calendarState;
    },
    selectEvent(state, action) {
      const eventId = action.payload;
      state.isOpenModal = true;
      state.selectedEventId = eventId;
      return state;
    },
    selectRange(state, action) {
      const { start, end } = action.payload;
      state.isOpenModal = true;
      state.selectedRange = { start, end };
      return state;
    },
    openModal(state) {
      state.isOpenModal = true;
      return state;
    },
    closeModal(state) {
      state.isOpenModal = false;
      state.selectedEventId = null;
      state.selectedRange = null;
      return state;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEvents.pending, (state) => {
        return {
          ...state,
          calendar: {
            ...state.calendar,
            error: null,
            loading: true
          }
        };
      })
      .addCase(getEvents.rejected, (state, action) => {
        return {
          ...state,
          calendar: {
            ...state.calendar,
            error: action.error.message,
            loading: false
          }
        };
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        return {
          ...state,
          calendar: {
            ...state.calendar,
            error: null,
            data: action.payload,
            loading: false
          }
        };
      });
  }
});

export const { resetCalendar, openModal, closeModal, selectEvent, selectRange } = calendar.actions;

export default calendar.reducer;
