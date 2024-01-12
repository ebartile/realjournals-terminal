import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@material-ui/core/styles';
import { Checkbox, TableRow, TableCell, Typography, Stack, Link, MenuItem } from '@material-ui/core';
// utils
import { fDateTime } from 'utils/formatTime';
import createAvatar from 'utils/createAvatar';
// components
import Label from 'components/Label';
import Avatar from 'components/Avatar';
import Iconify from 'components/Iconify';
import { TableMoreMenu } from 'components/table';

// ----------------------------------------------------------------------

AccountsTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func
};

export default function AccountsTableRow({ row, selected, onSelectRow, onViewRow }) {
  const theme = useTheme();

  const { username, server, created_date, account_type, name, currency, billing_type, broker } = row;

  return (
    <TableRow
      hover
      sx={{ cursor: 'pointer' }}
      selected={selected}
      onClick={() => {
        onViewRow();
      }}
    >
      <TableCell padding="checkbox" onClick={(event) => event.stopPropagation()}>
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell align="left">{username}</TableCell>

      <TableCell align="left">{server}</TableCell>

      <TableCell align="left">{fDateTime(created_date)}</TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(account_type === 'AUTO' && 'success') || (account_type === 'MANUAL' && 'info') || 'default'}
          sx={{ textTransform: 'capitalize' }}
        >
          {account_type}
        </Label>
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={'default'}
          sx={{ textTransform: 'capitalize' }}
        >
          {name}
        </Label>
      </TableCell>

      <TableCell align="left">{currency}</TableCell>

      <TableCell align="left">{billing_type}</TableCell>

      <TableCell align="left">{broker}</TableCell>
    </TableRow>
  );
}
