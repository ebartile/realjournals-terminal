import sumBy from 'lodash/sumBy';
import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import router from 'router/router';
// @mui
import { useTheme } from '@material-ui/core/styles';
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Stack,
  Switch,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
  LinearProgress,
  Button
} from '@material-ui/core';
// hooks
import useTabs from 'hooks/useTabs';
import useSettings from 'hooks/useSettings';
import useTable from 'hooks/useTable';
// components
import Page from 'components/Page';
import Label from 'components/Label';
import Iconify from 'components/Iconify';
import Scrollbar from 'components/Scrollbar';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from 'components/table';
import {
  TradeAnalytic,
  ActiveTradeTableRow,
  TradeTableToolbar,
  ClosedTradeTableRow,
  PendingOrdersTableRow,
  ClosedExecutedOrdersTableRow
} from './list';
import {
  fetchHistoryDeals,
  fetchHistoryOrders,
  fetchOrders,
  fetchPositionsOrders,
  setStartDate,
  setEndDate
} from 'store/slices/account';
import { useDispatch, useSelector } from 'react-redux';
import { useActiveAccount, useDates } from 'hooks/account';
import { get } from 'lodash';
import { fDateTime } from 'utils/formatTime';
import { DisplayTime, useDatePicker } from '../Home';
import { DesktopDateRangePicker } from '@material-ui/lab';

// ----------------------------------------------------------------------

const ACTIVE_TRADES_TABLE_HEAD = [
  { id: 'ticket', label: 'Ticket', align: 'left' },
  { id: 'symbol', label: 'Symbol', align: 'left' },
  { id: 'time', label: 'Create', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'reason', label: 'Executed By', align: 'left' },
  { id: 'price_open', label: 'Open Price', align: 'left' },
  { id: 'price_current', label: 'Current Price', align: 'left' },
  { id: 'profit', label: 'Profit/Loss', align: 'left' },
  { id: 'swap', label: 'Swap', align: 'left' },
  { id: 'sl', label: 'Stop Loss', align: 'left' },
  { id: 'tp', label: 'Take Profit', align: 'left' }
];

const CLOSED_TRADES_TABLE_HEAD = [
  { id: 'ticket', label: 'Ticket', align: 'left' },
  { id: 'symbol', label: 'Symbol', align: 'left' },
  { id: 'time', label: 'Create', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'entry', label: 'Entry', align: 'left' },
  { id: 'price', label: 'Price', align: 'left' },
  { id: 'profit', label: 'Profit/Loss', align: 'left' },
  { id: 'swap', label: 'Swap', align: 'left' },
  { id: 'fee', label: 'Fee', align: 'left' },
  { id: 'commission', label: 'Commission', align: 'left' },
  { id: 'reason', label: 'Executed By', align: 'left' }
];

const ACTIVE_PENDING_ORDERS_TABLE_HEAD = [
  { id: 'ticket', label: 'Ticket', align: 'left' },
  { id: 'symbol', label: 'Symbol', align: 'left' },
  { id: 'time', label: 'Create', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'entry', label: 'Entry', align: 'left' },
  { id: 'price_current', label: 'Current Price', align: 'left' },
  { id: 'volume_initial', label: 'Quantity', align: 'left' },
  { id: 'sl', label: 'Stop Loss', align: 'left' },
  { id: 'tp', label: 'Take Profit', align: 'left' }
];

const CLOSED_EXECUTED_ORDERS_TABLE_HEAD = [
  { id: 'ticket', label: 'Ticket', align: 'left' },
  { id: 'symbol', label: 'Symbol', align: 'left' },
  { id: 'time', label: 'Create', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'state', label: 'State', align: 'left' },
  { id: 'entry', label: 'Entry', align: 'left' },
  { id: 'price_current', label: 'Current Price', align: 'left' },
  { id: 'sl', label: 'Stop Loss', align: 'left' },
  { id: 'tp', label: 'Take Profit', align: 'left' }
];

// ----------------------------------------------------------------------

export default function TradeList() {
  const theme = useTheme();

  const { themeStretch } = useSettings();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activeAccount = useActiveAccount();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage
  } = useTable({ defaultOrderBy: 'time' });

  const [filterName, setFilterName] = useState('');

  const { start_date, end_date } = useDates();

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('active_trades');

  const [active_trades_page, setActiveTradesPage] = useState(0);
  const [closed_trades_page, setClosedTradesPage] = useState(0);
  const [active_pending_orders_page, setActivePendingOrdersPage] = useState(0);
  const [closed_executed_orders_page, setClosedExecutedOrdersPage] = useState(0);

  useEffect(() => {
    setActiveTradesPage(0);
    setClosedTradesPage(0);
    setActivePendingOrdersPage(0);
    setClosedExecutedOrdersPage(0);

    const queryHistoryDealsParams = new URLSearchParams();
    queryHistoryDealsParams.append('page', page + 1);
    queryHistoryDealsParams.append('itemPerPage', rowsPerPage);
    queryHistoryDealsParams.append('ticket', filterName);
    queryHistoryDealsParams.append('date_from', fDateTime(start_date, "yyyy-MM-dd'T'HH:mm:ss'Z'"));
    queryHistoryDealsParams.append('date_to', fDateTime(end_date, "yyyy-MM-dd'T'HH:mm:ss'Z'"));
    queryHistoryDealsParams.append('entry', '0');
    queryHistoryDealsParams.append('entry', '1');
    queryHistoryDealsParams.append('entry', '2');
    queryHistoryDealsParams.append('entry', '3');
    dispatch(
      fetchHistoryDeals({
        id: activeAccount.id,
        queryParams: queryHistoryDealsParams.toString()
      })
    );

    const queryHistoryOrdersParams = new URLSearchParams();
    queryHistoryOrdersParams.append('page', page + 1);
    queryHistoryOrdersParams.append('itemPerPage', rowsPerPage);
    queryHistoryOrdersParams.append('ticket', filterName);
    queryHistoryOrdersParams.append('date_from', fDateTime(start_date, "yyyy-MM-dd'T'HH:mm:ss'Z'"));
    queryHistoryOrdersParams.append('date_to', fDateTime(end_date, "yyyy-MM-dd'T'HH:mm:ss'Z'"));
    queryHistoryOrdersParams.append('state', 0);
    queryHistoryOrdersParams.append('state', 1);
    queryHistoryOrdersParams.append('state', 2);
    queryHistoryOrdersParams.append('state', 3);
    queryHistoryOrdersParams.append('state', 5);
    queryHistoryOrdersParams.append('state', 6);
    queryHistoryOrdersParams.append('state', 7);
    queryHistoryOrdersParams.append('state', 8);
    queryHistoryOrdersParams.append('state', 9);
    dispatch(
      fetchHistoryOrders({
        id: activeAccount.id,
        queryParams: queryHistoryOrdersParams.toString()
      })
    );

    // const queryPositionsOrdersParams = new URLSearchParams();
    // queryPositionsOrdersParams.append('page', page + 1);
    // queryPositionsOrdersParams.append('itemPerPage', rowsPerPage);
    // queryPositionsOrdersParams.append('ticket', filterName);
    // dispatch(
    //   fetchPositionsOrders({
    //     id: activeAccount.id,
    //     queryParams: queryPositionsOrdersParams.toString()
    //   })
    // );

    const queryOrdersParams = new URLSearchParams();
    queryOrdersParams.append('page', page + 1);
    queryOrdersParams.append('itemPerPage', rowsPerPage);
    if (filterName) {
      queryOrdersParams.append('ticket', filterName);
    }
    dispatch(
      fetchOrders({
        id: activeAccount.id,
        queryParams: queryOrdersParams.toString()
      })
    );
  }, [dispatch, rowsPerPage, start_date, end_date, activeAccount]);

  useEffect(() => {
    const params = {
      id: activeAccount.id,
      page: page,
      pageSize: rowsPerPage,
      search: {
        filterName: filterName,
        filterStartDate: fDateTime(start_date, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        filterEndDate: fDateTime(end_date, "yyyy-MM-dd'T'HH:mm:ss'Z'")
      }
    };

    if (filterStatus == 'active_trades') {
      const queryPositionsOrdersParams = new URLSearchParams();
      queryPositionsOrdersParams.append('page', page + 1);
      queryPositionsOrdersParams.append('itemPerPage', rowsPerPage);
      queryPositionsOrdersParams.append('ticket', filterName);
      dispatch(
        fetchPositionsOrders({
          id: activeAccount.id,
          queryParams: queryPositionsOrdersParams.toString()
        })
      );
    } else if (filterStatus == 'closed_trades') {
      const queryHistoryDealsParams = new URLSearchParams();
      queryHistoryDealsParams.append('page', page + 1);
      queryHistoryDealsParams.append('itemPerPage', rowsPerPage);
      queryHistoryDealsParams.append('ticket', filterName);
      queryHistoryDealsParams.append('date_from', fDateTime(start_date, "yyyy-MM-dd'T'HH:mm:ss'Z'"));
      queryHistoryDealsParams.append('date_to', fDateTime(end_date, "yyyy-MM-dd'T'HH:mm:ss'Z'"));
      queryHistoryDealsParams.append('entry', '0');
      queryHistoryDealsParams.append('entry', '1');
      queryHistoryDealsParams.append('entry', '2');
      queryHistoryDealsParams.append('entry', '3');
      dispatch(
        fetchHistoryDeals({
          id: activeAccount.id,
          queryParams: queryHistoryDealsParams.toString()
        })
      );
    } else if (filterStatus == 'active_pending_orders') {
      const queryOrdersParams = new URLSearchParams();
      queryOrdersParams.append('page', page + 1);
      queryOrdersParams.append('itemPerPage', rowsPerPage);
      if (filterName) {
        queryOrdersParams.append('ticket', filterName);
      }
      dispatch(
        fetchOrders({
          id: activeAccount.id,
          queryParams: queryOrdersParams.toString()
        })
      );
    } else if (filterStatus == 'closed_executed_orders') {
      const queryHistoryOrdersParams = new URLSearchParams();
      queryHistoryOrdersParams.append('page', page + 1);
      queryHistoryOrdersParams.append('itemPerPage', rowsPerPage);
      queryHistoryOrdersParams.append('ticket', filterName);
      queryHistoryOrdersParams.append('date_from', fDateTime(start_date, "yyyy-MM-dd'T'HH:mm:ss'Z'"));
      queryHistoryOrdersParams.append('date_to', fDateTime(end_date, "yyyy-MM-dd'T'HH:mm:ss'Z'"));
      queryHistoryOrdersParams.append('state', 0);
      queryHistoryOrdersParams.append('state', 1);
      queryHistoryOrdersParams.append('state', 2);
      queryHistoryOrdersParams.append('state', 3);
      queryHistoryOrdersParams.append('state', 5);
      queryHistoryOrdersParams.append('state', 6);
      queryHistoryOrdersParams.append('state', 7);
      queryHistoryOrdersParams.append('state', 8);
      queryHistoryOrdersParams.append('state', 9);
      dispatch(
        fetchHistoryOrders({
          id: activeAccount.id,
          queryParams: queryHistoryOrdersParams.toString()
        })
      );
    }
  }, [
    dispatch,
    active_trades_page,
    closed_trades_page,
    active_pending_orders_page,
    closed_executed_orders_page,
    filterName
  ]);

  const [loading, setLoading] = useState(false);

  const activeAccountHistoryDeals = useSelector((state) => get(state, 'account.activeAccountHistoryDeals', []));

  const activeAccountHistoryOrders = useSelector((state) => get(state, 'account.activeAccountHistoryOrders', []));

  const activeAccountPositionOrders = useSelector((state) => get(state, 'account.activeAccountPositionOrders', []));

  const activeAccountOrders = useSelector((state) => get(state, 'account.activeAccountOrders', []));

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (filterStatus == 'active_trades') {
      setTableData(activeAccountPositionOrders.data);
      // setLoading(activeAccountPositionOrders.loading);
    } else if (filterStatus == 'closed_trades') {
      setTableData(activeAccountHistoryDeals.data);
      // setLoading(activeAccountHistoryDeals.loading);
    } else if (filterStatus == 'active_pending_orders') {
      setTableData(activeAccountOrders.data);
      // setLoading(activeAccountOrders.loading);
    } else if (filterStatus == 'closed_executed_orders') {
      setTableData(activeAccountHistoryOrders.data);
      // setLoading(activeAccountHistoryOrders.loading);
    }
  }, [
    filterStatus,
    activeAccountPositionOrders,
    activeAccountHistoryDeals,
    activeAccountOrders,
    activeAccountHistoryOrders
  ]);

  const denseHeight = dense ? 56 : 76;

  const isNotFound =
    (!tableData.length && !!filterName) || (!tableData.length && !!end_date) || (!tableData.length && !!start_date);

  const total =
    activeAccountHistoryDeals.count +
    activeAccountPositionOrders.count +
    activeAccountPositionOrders.count +
    activeAccountHistoryOrders.count;

  const TABS = [
    { value: 'active_trades', label: 'Active Trades', color: 'success', count: activeAccountPositionOrders.count },
    {
      value: 'active_pending_orders',
      label: 'Pending Orders',
      color: 'warning',
      count: activeAccountOrders.count
    },
    {
      value: 'closed_executed_orders',
      label: 'Order History',
      color: 'error',
      count: activeAccountHistoryOrders.count
    },
    {
      value: 'closed_trades',
      label: 'Closed Trades',
      color: 'info',
      count: activeAccountHistoryDeals.count
    }
  ];

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

  return (
    <Page title="Trade: Journal">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Hi, Welcome back 👋"
          links={[
            {
              name: 'Analytics',
              href: router.generatePath('terminal-portal.analytics')
            },
            { name: 'Trades', href: router.generatePath('terminal-portal.trades') },
            { name: 'Journal' }
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

        <Card sx={{ mb: 5 }}>
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <TradeAnalytic
                title="Active Trades"
                total={activeAccountPositionOrders.count}
                percent={(activeAccountPositionOrders.count / total) * 100}
                icon="eva:checkmark-circle-2-fill"
                color={theme.palette.success.main}
              />
              <TradeAnalytic
                title="Pending Orders"
                total={activeAccountOrders.count}
                percent={(activeAccountOrders.count / total) * 100}
                icon="eva:clock-fill"
                color={theme.palette.warning.main}
              />
              <TradeAnalytic
                title="Order History"
                total={activeAccountHistoryOrders.count}
                percent={(activeAccountHistoryOrders.count / total) * 100}
                icon="eva:file-fill"
                color={theme.palette.error.main}
              />
              <TradeAnalytic
                title="Closed Trades"
                total={activeAccountHistoryDeals.count}
                percent={(activeAccountHistoryDeals.count / total) * 100}
                icon="ic:round-receipt"
                color={theme.palette.info.main}
              />
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={(event, value) => {
              onFilterStatus(event, value);
              value === 'active_trades'
                ? setPage(active_trades_page)
                : value === 'closed_trades'
                  ? setPage(closed_trades_page)
                  : value === 'active_pending_orders'
                    ? setPage(active_pending_orders_page)
                    : value === 'closed_executed_orders'
                      ? setPage(closed_executed_orders_page)
                      : setPage(active_trades_page);
            }}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {TABS.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                value={tab.value}
                label={
                  <Stack spacing={1} direction="row" alignItems="center">
                    <div>{tab.label}</div> <Label color={tab.color}> {tab.count} </Label>
                  </Stack>
                }
              />
            ))}
          </Tabs>

          <Divider />

          <TradeTableToolbar
            filterName={filterName}
            filterStartDate={new Date(start_date)}
            filterEndDate={new Date(end_date)}
            onFilterName={(filterName) => {
              setFilterName(filterName);
              setPage(0);
            }}
            onFilterStartDate={(newValue) => {
              dispatch(setStartDate(newValue));
              setPage(0);
            }}
            onFilterEndDate={(newValue) => {
              dispatch(setEndDate(newValue));
              setPage(0);
            }}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {loading && (
                <LoadingOverlay
                  sx={{
                    zIndex: 3,
                    background: theme.palette.background.default,
                    opacity: 0.5
                  }}
                />
              )}
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.ticket)
                    )
                  }
                  actions={
                    <Stack spacing={1} direction="row">
                      <Tooltip title="Sent">
                        <IconButton color="primary">
                          <Iconify icon={'ic:round-send'} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Download">
                        <IconButton color="primary">
                          <Iconify icon={'eva:download-outline'} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Print">
                        <IconButton color="primary">
                          <Iconify icon={'eva:printer-fill'} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={
                    filterStatus === 'active_trades'
                      ? ACTIVE_TRADES_TABLE_HEAD
                      : filterStatus === 'closed_trades'
                        ? CLOSED_TRADES_TABLE_HEAD
                        : filterStatus === 'active_pending_orders'
                          ? ACTIVE_PENDING_ORDERS_TABLE_HEAD
                          : filterStatus === 'closed_executed_orders'
                            ? CLOSED_EXECUTED_ORDERS_TABLE_HEAD
                            : ACTIVE_TRADES_TABLE_HEAD
                  }
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.ticket)
                    )
                  }
                />

                <TableBody>
                  {tableData.map((row) => {
                    let TableRowComponent = null;
                    switch (filterStatus) {
                      case 'active_trades':
                        TableRowComponent = (
                          <ActiveTradeTableRow
                            key={row.ticket}
                            row={row}
                            selected={selected.includes(row.ticket)}
                            onSelectRow={() => onSelectRow(row.ticket)}
                            onViewRow={() =>
                              navigate(
                                router.generatePath('terminal-portal.trade.detail', {
                                  id: row.ticket
                                })
                              )
                            }
                          />
                        );
                        break;
                      case 'closed_trades':
                        TableRowComponent = (
                          <ClosedTradeTableRow
                            key={row.ticket}
                            row={row}
                            selected={selected.includes(row.ticket)}
                            onSelectRow={() => onSelectRow(row.ticket)}
                            onViewRow={() =>
                              navigate(
                                router.generatePath('terminal-portal.closed-trade', {
                                  position: row.position_id
                                })
                              )
                            }
                          />
                        );
                        break;
                      case 'active_pending_orders':
                        TableRowComponent = (
                          <PendingOrdersTableRow
                            key={row.ticket}
                            row={row}
                            selected={selected.includes(row.ticket)}
                            onSelectRow={() => onSelectRow(row.ticket)}
                            onViewRow={() =>
                              navigate(
                                router.generatePath('terminal-portal.trade.detail', {
                                  id: row.ticket
                                })
                              )
                            }
                          />
                        );
                        break;
                      case 'closed_executed_orders':
                        TableRowComponent = (
                          <ClosedExecutedOrdersTableRow
                            key={row.ticket}
                            row={row}
                            selected={selected.includes(row.ticket)}
                            onSelectRow={() => onSelectRow(row.ticket)}
                            onViewRow={() =>
                              navigate(
                                router.generatePath('terminal-portal.trade.detail', {
                                  id: row.ticket
                                })
                              )
                            }
                          />
                        );
                        break;
                      default:
                        // Handle the default case or provide a fallback
                        break;
                    }
                    return TableRowComponent;
                  })}

                  <TableEmptyRows height={denseHeight} emptyRows={0} />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={
                filterStatus === 'active_trades'
                  ? activeAccountPositionOrders.count
                  : filterStatus === 'closed_trades'
                    ? activeAccountHistoryDeals.count
                    : filterStatus === 'active_pending_orders'
                      ? activeAccountOrders.count
                      : filterStatus === 'closed_executed_orders'
                        ? activeAccountHistoryOrders.count
                        : activeAccountPositionOrders.count
              }
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, value) => {
                onChangePage(event, value);
                filterStatus === 'active_trades'
                  ? setActiveTradesPage(value)
                  : filterStatus === 'closed_trades'
                    ? setClosedTradesPage(value)
                    : filterStatus === 'active_pending_orders'
                      ? setActivePendingOrdersPage(value)
                      : filterStatus === 'closed_executed_orders'
                        ? setClosedExecutedOrdersPage(value)
                        : setActiveTradesPage(value);
              }}
              onRowsPerPageChange={onChangeRowsPerPage}
            />

            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Dense"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

const LoadingOverlay = () => {
  return (
    <div style={{ position: 'absolute', top: 0, width: '100%' }}>
      <LinearProgress />
    </div>
  );
};

// ----------------------------------------------------------------------
