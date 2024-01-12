import sumBy from 'lodash/sumBy';
import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import router from 'router/router';
// @mui
import { alpha, useTheme } from '@material-ui/core/styles';
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
  Button,
  Typography
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
import { AccountsTableRow } from './list';
import account, { fetchAccount, fetchAccounts } from 'store/slices/account';
import { useDispatch, useSelector } from 'react-redux';
import { useAccounts, useActiveAccount, useDates } from 'hooks/account';
import { get } from 'lodash';
import { DesktopDateRangePicker } from '@material-ui/lab';
import { IconButtonAnimate } from 'components/animate';

// ----------------------------------------------------------------------

const ACCOUNTS_TABLE_HEAD = [
  { id: 'username', label: 'Username', align: 'left' },
  { id: 'server', label: 'Server', align: 'left' },
  { id: 'created_date', label: 'Create', align: 'left' },
  { id: 'account_type', label: 'Account Type', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'currency', label: 'Currency', align: 'left' },
  { id: 'billing_type', label: 'Billing Type', align: 'left' },
  { id: 'broker', label: 'Broker', align: 'left' }
];
// ----------------------------------------------------------------------

export default function TradeList() {
  const theme = useTheme();

  const { themeStretch } = useSettings();
  const accounts = useAccounts();

  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('all');

  const [account_page, setAccountPage] = useState(0);

  useEffect(() => {
    setAccountPage(0);
    dispatch(fetchAccounts());

    const queryParams = new URLSearchParams();
    queryParams.append('page', page + 1);
    queryParams.append('itemPerPage', rowsPerPage);
    queryParams.append('username', filterName);

    dispatch(
      fetchAccounts({
        queryParams: queryParams.toString()
      })
    );
  }, [dispatch, rowsPerPage, account_page]);

  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(accounts.data);
    setLoading(accounts.loading);
  }, [filterStatus, accounts]);

  const denseHeight = dense ? 56 : 76;

  const isNotFound = !tableData.length && !!filterName;

  const TABS = [
    {
      value: 'all',
      label: 'All',
      color: 'info',
      count: accounts.count
    }
  ];

  return (
    <Page title="Accounts: Journal">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Hi, Welcome back 👋"
          links={[
            {
              name: 'Analytics',
              href: router.generatePath('terminal-portal.analytics')
            },
            { name: 'Accounts' }
          ]}
          action={
            <Button component={RouterLink} to={router.generatePath('account-setup.steps')} variant="outlined">
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Add Account
                </Typography>
                <IconButtonAnimate
                  color="inherit"
                  sx={{
                    p: 1.25,
                    transition: (theme) => theme.transitions.create('all'),
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)
                    }
                  }}
                >
                  <Iconify icon="eva:plus-fill" width={20} height={20} />
                </IconButtonAnimate>
              </Stack>
            </Button>
          }
        />

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={(event, value) => {
              onFilterStatus(event, value);
              setPage(account_page);
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
                      <Tooltip title="Delete">
                        <IconButton color="primary">
                          <Iconify icon={'ic:trash'} />
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
                  headLabel={ACCOUNTS_TABLE_HEAD}
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
                      case 'all':
                        TableRowComponent = (
                          <AccountsTableRow
                            key={row.username}
                            row={row}
                            selected={selected.includes(row.username)}
                            onSelectRow={() => onSelectRow(row.username)}
                            onViewRow={() =>
                              navigate(
                                router.generatePath('terminal-portal.trade.detail', {
                                  id: row.username
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
              count={accounts.count}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, value) => {
                onChangePage(event, value);
                setAccountPage(value);
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
