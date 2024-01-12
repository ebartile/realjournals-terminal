import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useSnackbar } from 'notistack5';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { store, persistor } from 'store/store';
import { PersistGate } from 'redux-persist/lib/integration/react';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { BrowserRouter } from 'react-router-dom';

import LoadingScreen from 'components/LoadingScreen';
import { SettingsProvider } from 'contexts/SettingsContext';
import { CollapseDrawerProvider } from 'contexts/CollapseDrawerContext';
import ThemeConfig from 'theme';
import ThemePrimaryColor from 'components/general/ThemePrimaryColor';
import ThemeLocalization from 'components/general/ThemeLocalization';
import RtlLayout from 'components/general/RtlLayout';
import NotistackProvider from 'components/general/NotistackProvider';
import context, { AppContext } from 'context';

const mountPoint = document.createElement('div');
document.body.appendChild(mountPoint);

const notify = {
  success(message, options) {
    this.toast(message, 'success', options);
  },
  info(message, options) {
    this.toast(message, 'info', options);
  },
  warning(message, options) {
    this.toast(message, 'warning', options);
  },
  error(message, options) {
    this.toast(message, 'error', options);
  },
  toast(message, variant = 'default', options = {}) {
    const Display = () => {
      const { enqueueSnackbar } = useSnackbar();

      useEffect(() => {
        enqueueSnackbar(message, { ...options, variant });
      }, [enqueueSnackbar]);

      return null;
    };

    ReactDOM.render(
      <HelmetProvider>
        <ReduxProvider store={store}>
          <PersistGate loading={<LoadingScreen />} persistor={persistor}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <SettingsProvider>
                <CollapseDrawerProvider>
                  <BrowserRouter>
                    <ThemeConfig>
                      <ThemePrimaryColor>
                        <ThemeLocalization>
                          <RtlLayout>
                            <NotistackProvider>
                              <AppContext.Provider value={context}>
                                <Display />
                              </AppContext.Provider>
                            </NotistackProvider>
                          </RtlLayout>
                        </ThemeLocalization>
                      </ThemePrimaryColor>
                    </ThemeConfig>
                  </BrowserRouter>
                </CollapseDrawerProvider>
              </SettingsProvider>
            </LocalizationProvider>
          </PersistGate>
        </ReduxProvider>
      </HelmetProvider>,
      mountPoint
    );
  }
};

export default notify;
