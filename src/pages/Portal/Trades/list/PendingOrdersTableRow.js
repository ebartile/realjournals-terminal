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

PendingOrdersTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func
};

export default function PendingOrdersTableRow({ row, selected, onSelectRow, onViewRow }) {
  const theme = useTheme();

  const { ticket, symbol, time, type, price_open, price_current, volume_initial, sl, tp } = row;

  return (
    <TableRow
      hover
      sx={{ cursor: 'pointer' }}
      selected={selected}
      // onClick={() => {
      //   onViewRow();
      // }}
    >
      <TableCell padding="checkbox" onClick={(event) => event.stopPropagation()}>
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell align="left">{ticket}</TableCell>

      <TableCell align="left">{symbol}</TableCell>

      <TableCell align="left">{fDateTime(time)}</TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(type.includes('Buy') && 'success') || (type.includes('Sell') && 'error') || 'default'}
          sx={{ textTransform: 'capitalize' }}
        >
          {type}
        </Label>
      </TableCell>

      <TableCell align="left">{price_open}</TableCell>

      <TableCell align="left">{price_current}</TableCell>

      <TableCell align="center" color="default">
        {volume_initial * price_open}
      </TableCell>

      <TableCell align="left">{sl}</TableCell>

      <TableCell align="left">{tp}</TableCell>
    </TableRow>
  );
}
