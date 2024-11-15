import PropTypes from 'prop-types';
// @mui
import { Stack, Typography, Box, CircularProgress } from '@material-ui/core';
// components
import Iconify from 'components/Iconify';

// ----------------------------------------------------------------------

TradeAnalytic.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.string,
  percent: PropTypes.number,
  price: PropTypes.number,
  total: PropTypes.number
};

export default function TradeAnalytic({ title, total, icon, color, percent }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="center" sx={{ width: 1, minWidth: 200 }}>
      <Stack alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
        <Iconify icon={icon} sx={{ color, width: 24, height: 24, position: 'absolute' }} />

        <CircularProgress variant="determinate" value={percent} size={56} thickness={4} sx={{ color, opacity: 0.48 }} />

        <CircularProgress
          variant="determinate"
          value={100}
          size={56}
          thickness={4}
          sx={{ color: 'grey.50016', position: 'absolute', top: 0, left: 0, opacity: 0.48 }}
        />
      </Stack>

      <Stack spacing={0.5} sx={{ ml: 2 }}>
        <Typography variant="h6">{title}</Typography>

        <Typography variant="subtitle2">
          {total}{' '}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            trades
          </Box>
        </Typography>
      </Stack>
    </Stack>
  );
}
