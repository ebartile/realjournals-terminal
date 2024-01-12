import React from 'react';
import { Stack } from '@material-ui/core';

const ModalActions = ({ sx, ...otherProps }) => {
  return <Stack direction="row" justifyContent="flex-end" sx={{ py: 2, ...sx }} {...otherProps} />;
};

export default ModalActions;
