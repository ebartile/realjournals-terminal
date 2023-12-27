import PropTypes from 'prop-types';
// @mui
import { styled, useTheme } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Grid,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  Paper,
  TableContainer,
  LinearProgress
} from '@material-ui/core';
// utils
import { fDateTime, findBestTimeframe } from 'utils/formatTime';
import { fCurrency } from 'utils/formatNumber';
// components
import Label from 'components/Label';
import Image from 'components/Image';
import Scrollbar from 'components/Scrollbar';
//
import ClosedTradeDetailsToolbar from './ClosedTradeDetailsToolbar';
import { useDispatch, useSelector } from 'react-redux';
import { useActiveAccount } from 'hooks/account';
import { fetchHistoryDeals, fetchHistoryOrders } from 'redux/slices/account';
import { get } from 'lodash';
import { useEffect, useState, useRef, useCallback } from 'react';
import EmptyContent from 'assets/empty_content';
import { route, useRequest } from 'services/Http';
import notify from 'utils/notify';
import { timeParse } from 'd3-time-format';
import { format } from 'date-fns';

ClosedTradeDetail.propTypes = {
  position: PropTypes.number.isRequired
};

export default function ClosedTradeDetail({ position }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const activeAccount = useActiveAccount();
  const [request, loading] = useRequest();
  const [request2] = useRequest();
  const [trade, setTrade] = useState([]);
  const [order, setOrder] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const queryParams = new URLSearchParams();
    queryParams.append('position', position);
    request
      .get(`${route('accounts.history_orders_get', activeAccount.id)}?${queryParams}`)
      .then((response) => {
        setOrder(response.results);
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data._error_message) {
          notify.error(error.response.data._error_message);
        }
      });
    request
      .get(`${route('accounts.history_deals_get', activeAccount.id)}?${queryParams}`)
      .then((response) => {
        setTrade(response.results);
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data._error_message) {
          notify.error(error.response.data._error_message);
        }
      });
  }, [dispatch]);

  if (loading) {
    return <LinearProgress />;
  }

  if (!trade.length > 0 || !order.length > 0) {
    return <EmptyContent title="No Data" />;
  }

  const startTime = new Date(order[1].time).getTime();
  const endTime = new Date(order[0].time).getTime();
  const timeframe = findBestTimeframe(startTime, endTime);
  console.log(timeframe);
  const iframeUrl = `https://charts.realjournals.com/?symbol=${order[0].symbol.replace(
    /m/g,
    ''
  )}&timeframe=${timeframe}&toolbar=false&night=false&startTime=${startTime}&endTime=${endTime}`;

  return (
    <>
      <ClosedTradeDetailsToolbar trade={trade[0]} />

      <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Image disabledEffect visibleByDefault alt="logo" src="/static/logo/mt5.svg" sx={{ maxWidth: 120 }} />
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Box sx={{ textAlign: { sm: 'right' } }}>
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={'default'}
                sx={{ textTransform: 'uppercase', mb: 1 }}
              >
                {trade[0].entry}
              </Label>

              <Typography variant="h6">TicketID: {order[0].ticket}</Typography>
              <Typography variant="h5">{order[0].symbol}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Order Entry
            </Typography>
            <Typography variant="body2">Order ID: {order[1].ticket}</Typography>
            <Typography variant="body2">State: {order[1].state}</Typography>
            <Typography variant="body2">Executed By: {order[1].reason}</Typography>
            <Typography variant="body2">
              Type:
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={(order[1].type === 'Buy' && 'success') || (order[1].type === 'Sell' && 'error') || 'default'}
                sx={{ textTransform: 'capitalize' }}
              >
                {order[1].type}
              </Label>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Order Exit
            </Typography>
            <Typography variant="body2">Order ID: {order[0].ticket}</Typography>
            <Typography variant="body2">State: {order[0].state}</Typography>
            <Typography variant="body2">Executed By: {order[0].reason}</Typography>
            <Typography variant="body2">
              Type:
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={(order[0].type === 'Buy' && 'success') || (order[0].type === 'Sell' && 'error') || 'default'}
                sx={{ textTransform: 'capitalize' }}
              >
                {order[0].type}
              </Label>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Create Date
            </Typography>
            <Typography variant="body2">{fDateTime(order[1].time)}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Close Date
            </Typography>
            <Typography variant="body2">{fDateTime(order[0].time)}</Typography>
          </Grid>

          <Grid item xs={12} sm={12} sx={{ mb: 5, height: 600 }}>
            <iframe title="charts" width="100%" height="100%" src={iframeUrl} allowFullScreen></iframe>
          </Grid>

          <Grid item xs={12} sm={12} sx={{ mb: 5 }}></Grid>
        </Grid>
      </Card>

      {/* <Scrollbar>
          <TableContainer sx={{ minWidth: 960 }}>
            <Table>
              <TableHead
                sx={{
                  borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                  '& th': { backgroundColor: 'transparent' }
                }}
              >
                <TableRow>
                  <TableCell width={40}>#</TableCell>
                  <TableCell align="left">Description</TableCell>
                  <TableCell align="left">Qty</TableCell>
                  <TableCell align="right">Unit price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: (theme) => `solid 1px ${theme.palette.divider}`
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell align="left">
                      <Box sx={{ maxWidth: 560 }}>
                        <Typography variant="subtitle2">{row.title}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                          {row.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="left">{row.quantity}</TableCell>
                    <TableCell align="right">{fCurrency(row.price)}</TableCell>
                    <TableCell align="right">{fCurrency(row.price * row.quantity)}</TableCell>
                  </TableRow>
                ))}

                <RowResultStyle>
                  <TableCell colSpan={3} />
                  <TableCell align="right">
                    <Box sx={{ mt: 2 }} />
                    <Typography>Subtotal</Typography>
                  </TableCell>
                  <TableCell align="right" width={120}>
                    <Box sx={{ mt: 2 }} />
                    <Typography>{fCurrency(subTotalPrice)}</Typography>
                  </TableCell>
                </RowResultStyle>

                <RowResultStyle>
                  <TableCell colSpan={3} />
                  <TableCell align="right">
                    <Typography>Discount</Typography>
                  </TableCell>
                  <TableCell align="right" width={120}>
                    <Typography sx={{ color: 'error.main' }}>{discount && fCurrency(-discount)}</Typography>
                  </TableCell>
                </RowResultStyle>

                <RowResultStyle>
                  <TableCell colSpan={3} />
                  <TableCell align="right">
                    <Typography>Taxes</Typography>
                  </TableCell>
                  <TableCell align="right" width={120}>
                    <Typography>{taxes && fCurrency(taxes)}</Typography>
                  </TableCell>
                </RowResultStyle>

                <RowResultStyle>
                  <TableCell colSpan={3} />
                  <TableCell align="right">
                    <Typography variant="h6">Total</Typography>
                  </TableCell>
                  <TableCell align="right" width={140}>
                    <Typography variant="h6">{fCurrency(totalPrice)}</Typography>
                  </TableCell>
                </RowResultStyle>
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Divider sx={{ mt: 5 }} />

        <Grid container>
          <Grid item xs={12} md={9} sx={{ py: 3 }}>
            <Typography variant="subtitle2">NOTES</Typography>
            <Typography variant="body2">
              We appreciate your business. Should you need us to add VAT or extra notes let us know!
            </Typography>
          </Grid>
          <Grid item xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
            <Typography variant="subtitle2">Have a Question?</Typography>
            <Typography variant="body2">support@minimals.cc</Typography>
          </Grid>
        </Grid>
      </Card> */}
    </>
  );
}
