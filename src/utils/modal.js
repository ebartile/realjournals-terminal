import PropTypes from 'prop-types';
import React, { cloneElement, isValidElement, useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@material-ui/core';
import { usePatchElement } from 'hooks/usePatchElement';
import { LoadingButton } from '@material-ui/lab';
import { isFunction } from 'lodash';
import { mountHandler } from './helpers';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { store, persistor } from 'redux/store';
import { PersistGate } from 'redux-persist/lib/integration/react';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { BrowserRouter } from 'react-router-dom';

import LoadingScreen from 'components/LoadingScreen';
import { SettingsProvider } from 'contexts/SettingsContext';
import { CollapseDrawerProvider } from 'contexts/CollapseDrawerContext';

const mountPoint = document.createElement('div');
document.body.appendChild(mountPoint);

let modalKey = 0;

const Modal = ({
  title,
  icon = null,
  iconColor = 'info.main',
  content,
  rootProps,
  okText = 'Ok',
  okButtonProps,
  onOk,
  cancelText = 'Cancel',
  onCancel,
  cancelButtonProps,
  afterClose = () => {}
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);

  const closeModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handler = mountHandler();
    if (!open) {
      setTimeout(() => handler.execute(afterClose), 1000);
    }
    return () => {
      handler.unmount();
    };
  }, [open, afterClose]);

  const handleCancel = () => {
    if (!onCancel?.length) {
      return !onCancel?.() && closeModal?.();
    } else {
      onCancel?.(closeModal);
    }

    return null;
  };

  const handleOk = () => {
    if (!onOk?.length) {
      return !onOk?.() && closeModal?.();
    } else {
      onOk?.(closeModal, setLoading);
    }
    return null;
  };

  const hideAction = useMemo(() => {
    return !isFunction(onOk) && !isFunction(onCancel);
  }, [onOk, onCancel]);

  return (
    <Dialog {...rootProps} onClose={closeModal} open={open}>
      {title && (
        <DialogTitle>
          <Stack direction="row" alignItems="center">
            {icon && (
              <Box component="span" sx={{ mr: 2 }}>
                <icon.type
                  {...icon.props}
                  sx={{
                    display: 'flex',
                    color: iconColor,
                    ...icon.props.sx,
                    fontSize: 30
                  }}
                />
              </Box>
            )}
            <Box component="span">{title}</Box>
          </Stack>
        </DialogTitle>
      )}

      <DialogContent sx={{ overflowX: 'hidden' }}>
        {isValidElement(content) ? cloneElement(content, { closeModal }) : content}
      </DialogContent>

      {!hideAction && (
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={handleCancel} {...cancelButtonProps}>
            {cancelText}
          </Button>
          <LoadingButton variant="contained" loading={loading} color="inherit" onClick={handleOk} {...okButtonProps}>
            {okText}
          </LoadingButton>
        </DialogActions>
      )}
    </Dialog>
  );
};

const modal = {
  confirm(props) {
    modalKey = modalKey + 1;
    ReactDOM.render(
      <HelmetProvider>
        <ReduxProvider store={store}>
          <PersistGate loading={<LoadingScreen />} persistor={persistor}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <SettingsProvider>
                <CollapseDrawerProvider>
                  <BrowserRouter>
                    <Modal {...props} key={`modal-${modalKey}`} />
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

function useModal() {
  const [elements, patch] = usePatchElement();
  const api = useMemo(
    () => ({
      confirm(props) {
        let removeModal = () => {};
        modalKey = modalKey + 1;
        const modal = (
          <Modal
            {...props}
            key={`modal-${modalKey}`}
            afterClose={() => {
              removeModal?.();
            }}
          />
        );
        removeModal = patch(modal);
      }
    }),
    [patch]
  );

  return [api, elements];
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.element,
  iconColor: PropTypes.string,
  content: PropTypes.node.isRequired,
  rootProps: PropTypes.object,
  okText: PropTypes.string,
  okButtonProps: PropTypes.object,
  onOk: PropTypes.func.isRequired,
  cancelText: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  cancelButtonProps: PropTypes.object,
  afterClose: PropTypes.func
};

export { useModal };
export default modal;
