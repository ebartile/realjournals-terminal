import React from 'react';
import { Stack } from '@material-ui/core';

const ModalContent = ({ sx, ...otherProps }) => {
  return <Stack sx={{ pb: 1, ...sx }} {...otherProps} />;
};

export default ModalContent;
