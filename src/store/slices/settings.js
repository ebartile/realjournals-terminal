import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { route, thunkRequest } from 'services/Http';
import { assign } from 'lodash';

export const settingsState = {
  layout: 'vertical',
  locales: {},
  modules: {},
  windowSize: {
    width: 1200,
    height: 900
  },
  locale: {
    error: null,
    loading: false,
    data: {
      locale: 'en',
      messages: {}
    }
  },
  recaptcha: {
    enable: false,
    sitekey: '',
    size: 'normal'
  },
  theme: {
    mode: 'dark',
    direction: 'ltr',
    color: 'orange'
  },
  brand: {
    faviconUrl: null,
    logoUrl: null,
    supportUrl: null,
    termsUrl: null,
    policyUrl: null
  },
  crsf_token: null,
  error: null,
  loading: false
};

export const initSettingsState = () => {
  return assign({}, settingsState);
};

export const fetchSettings = createAsyncThunk('settings/fetchSettings', (arg, api) => {
  return thunkRequest(api).get(route('config.get'));
});

export const fetchLocale = createAsyncThunk('settings/fetchLocale', (arg, api) => {
  return thunkRequest(api).get(route('locale.get'));
});

export const updateLocale = createAsyncThunk('settings/updateLocale', (locale, api) => {
  return thunkRequest(api).post(route('locale.set'), { locale });
});

const settings = createSlice({
  name: 'settings',
  initialState: settingsState,
  reducers: {
    setCrsfToken: (state, action) => {
      state.crsf_token = action.payload;
      return state;
    },
    setWindowSize: (state, action) => {
      state.windowSize = action.payload;
      return state;
    },
    setRecaptcha: (state, action) => {
      state.recaptcha = action.payload;
      return state;
    },
    setLocaleData: (state, action) => {
      state.localeData = action.payload;
      return state;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        return {
          ...state,
          error: null,
          loading: true
        };
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        return {
          ...state,
          error: action.error.message,
          loading: false
        };
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        return {
          ...state,
          ...action.payload.settings,
          error: null,
          loading: false
        };
      })
      .addCase(fetchLocale.pending, (state) => {
        state.locale = {
          ...state.locale,
          error: null,
          loading: true
        };
      })
      .addCase(fetchLocale.rejected, (state, action) => {
        state.locale = {
          ...state.locale,
          error: action.error.message,
          loading: false
        };
      })
      .addCase(fetchLocale.fulfilled, (state, action) => {
        state.locale = {
          ...state.locale,
          error: null,
          data: action.payload,
          loading: false
        };
      })
      .addCase(updateLocale.pending, (state) => {
        state.locale = {
          ...state.locale,
          error: null,
          loading: true
        };
      })
      .addCase(updateLocale.rejected, (state, action) => {
        state.locale = {
          ...state.locale,
          error: action.error.message,
          loading: false
        };
      })
      .addCase(updateLocale.fulfilled, (state, action) => {
        state.locale = {
          ...state.locale,
          error: null,
          data: action.payload,
          loading: false
        };
      });
  }
});

export const { setWindowSize, setRecaptcha, setLocaleData } = settings.actions;

export default settings.reducer;
