import React from 'react';
import { Icon } from '@iconify/react';
import { Box } from '@material-ui/core';

const Iconify = (props) => {
  return <Box component={Icon} {...props} />;
};

export default Iconify;
