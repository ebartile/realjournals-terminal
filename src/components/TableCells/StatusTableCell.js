import React from 'react';
import { Chip } from '@material-ui/core';

const StatusTableCell = ({ status }) => {
  switch (status) {
    case 'pending':
      return <Chip size="small" color="info" label="Pending" />;
    case 'approved':
      return <Chip size="small" color="success" label="Approved" />;
    case 'rejected':
      return <Chip size="small" color="error" label="Rejected" />;
    default:
      return null;
  }
};

export default StatusTableCell;
