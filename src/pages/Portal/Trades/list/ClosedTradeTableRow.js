import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@material-ui/core/styles';
import { Checkbox, TableRow, TableCell, Typography, Stack, Link, MenuItem } from '@material-ui/core';
// utils
import { fDateTime } from 'utils/formatTime';
import createAvatar from 'utils/createAvatar';
import { fCurrency, fShortenNumber } from 'utils/formatNumber';
// components
import Label from 'components/Label';
import Avatar from 'components/Avatar';
import Iconify from 'components/Iconify';
import { TableMoreMenu } from 'components/table';

// ----------------------------------------------------------------------

ClosedTradeTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func
};

export default function ClosedTradeTableRow({ row, selected, onSelectRow, onViewRow }) {
  const theme = useTheme();

  const { ticket, symbol, time, type, entry, reason, price, profit, swap, fee, commission } = row;

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

      <TableCell align="left">{ticket}</TableCell>

      <TableCell align="left">{symbol}</TableCell>

      <TableCell align="left">{fDateTime(time)}</TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(type === 'Buy' && 'success') || (type === 'Sell' && 'error') || 'default'}
          sx={{ textTransform: 'capitalize' }}
        >
          {type}
        </Label>
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={'default'}
          sx={{ textTransform: 'capitalize' }}
        >
          {entry}
        </Label>
      </TableCell>

      <TableCell align="left">{fShortenNumber(price)}</TableCell>

      <TableCell align="center" color={(profit > 0 && 'success') || (profit < 0 && 'error') || 'default'}>
        {fCurrency(profit)}
      </TableCell>

      <TableCell align="left">{swap}</TableCell>

      <TableCell align="left">{fCurrency(fee)}</TableCell>

      <TableCell align="left">{fCurrency(commission)}</TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={'default'}
          sx={{ textTransform: 'capitalize' }}
        >
          {reason}
        </Label>
      </TableCell>
    </TableRow>
  );
}
