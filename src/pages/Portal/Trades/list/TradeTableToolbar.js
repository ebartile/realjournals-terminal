import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem, Tooltip, IconButton } from '@material-ui/core';
import DatePicker from '@material-ui/lab/DatePicker';
// components
import Iconify from 'components/Iconify';
import { DesktopDateRangePicker } from '@material-ui/lab';
import { DisplayTime, useDatePicker } from 'pages/Portal/Home';

// ----------------------------------------------------------------------

const INPUT_WIDTH = 160;

TradeTableToolbar.propTypes = {
  filterName: PropTypes.string,
  filterEndDate: PropTypes.instanceOf(Date),
  filterStartDate: PropTypes.instanceOf(Date),
  onFilterName: PropTypes.func,
  onFilterEndDate: PropTypes.func,
  onFilterStartDate: PropTypes.func
};

export default function TradeTableToolbar({
  filterStartDate,
  filterEndDate,
  filterName,
  onFilterName,
  onFilterStartDate,
  onFilterEndDate
}) {
  const {
    dueDate,
    startTime,
    endTime,
    isSameDays,
    isSameMonths,
    onChangeDueDate,
    openPicker,
    onOpenPicker,
    onClosePicker
  } = useDatePicker({
    date: [filterStartDate, filterEndDate]
  });

  return (
    <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2.5, px: 3 }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        {startTime && endTime && (
          <DisplayTime
            startTime={startTime}
            endTime={endTime}
            isSameDays={isSameDays}
            isSameMonths={isSameMonths}
            onOpenPicker={onOpenPicker}
          />
        )}
        <Tooltip title="Select Date Range">
          <IconButton size="small" onClick={onOpenPicker}>
            <Iconify icon={'eva:calendar-fill'} width={20} height={20} />
          </IconButton>
        </Tooltip>

        <DesktopDateRangePicker
          open={openPicker}
          onClose={onClosePicker}
          onOpen={onOpenPicker}
          maxDate={new Date()}
          value={dueDate}
          desktopMode
          onChange={(date, input) => {
            onFilterStartDate(date[0]);
            onFilterEndDate(date[1]);
            onChangeDueDate(date);
          }}
          renderInput={() => {}}
        />
      </Stack>

      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Search Ticket Number"
        type="number"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          )
        }}
      />
    </Stack>
  );
}
