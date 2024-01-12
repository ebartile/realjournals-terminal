import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import accountReducer from './slices/account';
import calendarReducer from './slices/calendar';
import authReducer from './slices/auth';
import brokersReducer from './slices/brokers';
import settingsReducer from './slices/settings';
import globalReducer from './slices/global';

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
};

const accountPersistConfig = {
  key: 'account',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy']
};

const rootReducer = combineReducers({
  auth: authReducer,
  brokers: brokersReducer,
  settings: settingsReducer,
  calendar: calendarReducer,
  account: persistReducer(accountPersistConfig, accountReducer),
  global: globalReducer
});

export { rootPersistConfig, rootReducer };
