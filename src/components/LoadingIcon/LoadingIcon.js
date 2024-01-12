import React from 'react';
import { CircularProgress } from '@material-ui/core';

const LoadingIcon = ({ loading, component: IconComponent, ...otherProps }) => {
  return loading ? <CircularProgress size="1rem" /> : <IconComponent {...otherProps} />;
};

export default LoadingIcon;
