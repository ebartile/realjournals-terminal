import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { format, isSameDay, isSameMonth } from 'date-fns';
import ResponsiveWidgets from './components/ResponsiveWidgets';
import widgets from './widgets';
import Page from 'components/Page';
import useSettings from 'hooks/useSettings';
import { Container, Stack, Tooltip, IconButton, Box, Button, Tab, Tabs } from '@material-ui/core';
import { useAuth } from 'models/Auth';
import router from 'router/router';
import { DesktopDateRangePicker } from '@material-ui/lab';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Iconify from 'components/Iconify';
import { useAccountSelector, useActiveAccount, useDates } from 'hooks/account';
import { useDispatch } from 'react-redux';
import { fetchAccountStats, setEndDate, setStartDate } from 'store/slices/account';
import roundReceipt from '@iconify/icons-ic/round-receipt';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
import Calendar from './components/Calendar';
import { capitalCase } from 'change-case';
import { Icon } from '@iconify/react';
import { fDateTime } from 'utils/formatTime';

const Home = () => {
  const auth = useAuth();
  const { themeStretch } = useSettings();
  const activeAccount = useActiveAccount();
  const dispatch = useDispatch();
  const { start_date, end_date } = useDates();
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
    date: [start_date, end_date]
  });

  useEffect(() => {
    const queryParams = new URLSearchParams();
    queryParams.append('date_from', fDateTime(start_date, "yyyy-MM-dd'T'HH:mm:ss'Z'"));
    queryParams.append('date_to', fDateTime(end_date, "yyyy-MM-dd'T'HH:mm:ss'Z'"));
    dispatch(
      fetchAccountStats({
        id: activeAccount.id,
        queryParams: queryParams.toString()
      })
    );
  }, [dispatch, start_date, end_date, activeAccount]);

  const [currentTab, setCurrentTab] = useState('statistics');

  let TABS = [
    {
      value: 'statistics',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <ResponsiveWidgets widgets={widgets} page="terminal.dashboard" />
    },
    {
      value: 'calendar',
      icon: <Icon icon={roundReceipt} width={20} height={20} />,
      component: <Calendar />
    }
  ];

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Page title="Analytics | Real Journals">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Hi, Welcome back 👋"
          links={[
            {
              name: 'Analytics',
              href: router.generatePath('terminal-portal.analytics')
            }
          ]}
          action={
            <Button onClick={onOpenPicker} variant="outlined">
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
                  <>
                    <Iconify icon={'eva:calendar-fill'} width={20} height={20} />
                  </>
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
            </Button>
          }
        />

        <Stack spacing={5}>
          <Tabs centered value={currentTab} allowScrollButtonsMobile onChange={handleChangeTab}>
            {TABS.map((tab) => (
              <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} icon={tab.icon} value={tab.value} />
            ))}
          </Tabs>

          {TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>;
          })}
        </Stack>
      </Container>
    </Page>
  );
};

// ----------------------------------------------------------------------

export function useDatePicker({ date }) {
  const [dueDate, setDueDate] = useState([date[0], date[1]]);
  const [openPicker, setOpenPicker] = useState(false);
  const dispatch = useDispatch();

  const startTime = dueDate[0] || '';
  const endTime = dueDate[1] || '';

  const isSameDays = isSameDay(new Date(startTime), new Date(endTime));
  const isSameMonths = isSameMonth(new Date(startTime), new Date(endTime));

  const handleChangeDueDate = (newValue) => {
    if (newValue[0] !== null) {
      dispatch(setStartDate(newValue[0].toISOString()));
    }
    if (newValue[1] !== null) {
      dispatch(setEndDate(newValue[1].toISOString()));
    }
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
