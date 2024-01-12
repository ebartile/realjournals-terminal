import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { Icon } from '@iconify/react';
import trendingUpFill from '@iconify/icons-eva/trending-up-fill';
import trendingDownFill from '@iconify/icons-eva/trending-down-fill';
import diagonalArrowLeftDownFill from '@iconify/icons-eva/diagonal-arrow-left-down-fill';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { Card, Typography, Stack } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { useActiveAccount, useActiveAccountStats, useDates } from 'hooks/account';
import { BaseOptionChart } from 'components/charts';
import { fNumber, fPercent } from 'utils/formatNumber';
import { fDate } from 'utils/formatTime';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  height: '100%',
  boxShadow: 'none',
  position: 'relative',
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  width: 48,
  height: 48,
  display: 'flex',
  borderRadius: '50%',
  position: 'absolute',
  alignItems: 'center',
  top: theme.spacing(3),
  right: theme.spacing(3),
  justifyContent: 'center',
  color: theme.palette.primary.lighter,
  backgroundColor: theme.palette.primary.dark
}));

// ----------------------------------------------------------------------

const NetProfitLoss = () => {
  const theme = useTheme();
  const { net_profit, net_loss, net_profit_loss_data, net_profit_loss_labels } = useActiveAccountStats();
  const { start_date, end_date } = useDates();

  let percentageNet = 0;

  if (net_profit + net_loss !== 0) {
    percentageNet = (net_profit / (net_profit + net_loss)) * 100;
  }

  const chartOptions = merge(BaseOptionChart(), {
    labels: net_profit_loss_labels,
    colors: [percentageNet < 0 ? theme.palette.warning.main : theme.palette.primary.main],
    chart: { sparkline: { enabled: true } },
    xaxis: { labels: { show: false } },
    yaxis: { labels: { show: false } },
    stroke: { width: 4 },
    legend: { show: false },
    grid: { show: false },
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => seriesName,
        title: {
          formatter: () => ''
        }
      }
    },
    fill: { gradient: { opacityFrom: 0.56, opacityTo: 0.56 } }
  });

  return (
    <RootStyle
      sx={{
        ...(percentageNet < 0 && {
          color: theme.palette.warning.darker,
          backgroundColor: theme.palette.warning.lighter
        })
      }}
    >
      <IconWrapperStyle
        sx={{
          ...(percentageNet < 0 && {
            color: theme.palette.warning.lighter,
            backgroundColor: theme.palette.warning.dark
          })
        }}
      >
        <Icon icon={percentageNet >= 0 ? trendingUpFill : trendingDownFill} width={24} height={24} />
      </IconWrapperStyle>

      <Stack spacing={1} sx={{ p: 3 }}>
        <Typography sx={{ typography: 'subtitle2' }}>Net Profit & Loss</Typography>
        <Typography sx={{ typography: 'h3' }}>{fNumber(net_profit + net_loss)}</Typography>
        <Typography sx={{ typography: 'subtitle2' }}>
          {fDate(start_date)} - {fDate(end_date)}
        </Typography>
        <Stack direction="row" alignItems="center" flexWrap="wrap">
          <Icon width={20} height={20} icon={percentageNet >= 0 ? trendingUpFill : trendingDownFill} />
          <Typography variant="subtitle2" component="span" sx={{ ml: 0.5 }}>
            {percentageNet > 0 && '+'}
            {fPercent(percentageNet)}
          </Typography>
        </Stack>
      </Stack>

      <ReactApexChart type="area" series={[{ data: net_profit_loss_data }]} options={chartOptions} height={160} />
    </RootStyle>
  );
};

NetProfitLoss.dimensions = {
  lg: { w: 3, h: 2, isResizable: true },
  md: { w: 4, h: 2, isResizable: true },
  sm: { w: 12, h: 2, isResizable: true },
  xs: { w: 12, h: 2, isResizable: true }
};

export default NetProfitLoss;
