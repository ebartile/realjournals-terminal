import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './slices/user';
import accountReducer from './slices/account';
import calendarReducer from './slices/calendar';
import authReducer from './slices/auth';
import globalReducer from './slices/global';
import settingsReducer from './slices/settings';

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
  global: globalReducer,
  settings: settingsReducer,
  user: userReducer,
  calendar: calendarReducer,
  account: persistReducer(accountPersistConfig, accountReducer)
});

export { rootPersistConfig, rootReducer };
