import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { format, isSameDay, isSameMonth } from 'date-fns';
import ResponsiveWidgets from './components/ResponsiveWidgets';
import widgets from './widgets';
import Page from 'components/Page';
import useSettings from 'hooks/useSettings';
import { Container, Stack, Tooltip, IconButton, Box } from '@material-ui/core';
import { useAuth } from 'models/Auth';
import router from 'router/router';
import { DesktopDateRangePicker } from '@material-ui/lab';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Iconify from 'components/Iconify';
import { useActiveAccount } from 'hooks/account';

const Home = () => {
  const auth = useAuth();
  const { themeStretch } = useSettings();
  const activeAccount = useActiveAccount();
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
    date: [new Date(activeAccount.start_date), new Date(activeAccount.end_date)]
  });

  return (
    <Page title="Dashboard | Real Journals">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Hi, Welcome back 👋"
          links={[{ name: 'Dashboard', href: router.generatePath('terminal-portal.dashboard') }]}
          action={
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
                onChange={onChangeDueDate}
                renderInput={() => {}}
              />
            </Stack>
          }
        />
        <ResponsiveWidgets widgets={widgets} page="terminal.dashboard" />
      </Container>
    </Page>
  );
};

// ----------------------------------------------------------------------

export function useDatePicker({ date }) {
  const [dueDate, setDueDate] = useState([date[0], date[1]]);
  const [openPicker, setOpenPicker] = useState(false);

  const startTime = dueDate[0] || '';
  const endTime = dueDate[1] || '';

  const isSameDays = isSameDay(new Date(startTime), new Date(endTime));
  const isSameMonths = isSameMonth(new Date(startTime), new Date(endTime));

  const handleChangeDueDate = (newValue) => {
    setDueDate(newValue);
  };

  const handleOpenPicker = () => {
    setOpenPicker(true);
  };

  const handleClosePicker = () => {
    setOpenPicker(false);
  };

  return {
    dueDate,
    startTime,
    endTime,
    isSameDays,
    isSameMonths,
    onChangeDueDate: handleChangeDueDate,
    openPicker,
    onOpenPicker: handleOpenPicker,
    onClosePicker: handleClosePicker
  };
}

// ----------------------------------------------------------------------

DisplayTime.propTypes = {
  isSameDays: PropTypes.bool,
  isSameMonths: PropTypes.bool,
  onOpenPicker: PropTypes.func,
  startTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
  endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
  sx: PropTypes.object
};

export function DisplayTime({ startTime, endTime, isSameDays, isSameMonths, onOpenPicker, sx }) {
  const style = {
    typography: 'caption',
    cursor: 'pointer',
    '&:hover': { opacity: 0.72 }
  };

  if (isSameMonths) {
    return (
      <Box onClick={onOpenPicker} sx={{ ...style, ...sx }}>
        {isSameDays
          ? format(new Date(endTime), 'dd MMM yyyy')
          : `${format(new Date(startTime), 'dd')} - ${format(new Date(endTime), 'dd MMM yyyy')}`}
      </Box>
    );
  }
  return (
    <Box onClick={onOpenPicker} sx={{ ...style, ...sx }}>
      {format(new Date(startTime), 'dd MMM yyyy')} - {format(new Date(endTime), 'dd MMM yyyy')}
    </Box>
  );
}

export default Home;
