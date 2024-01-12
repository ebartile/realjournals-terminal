import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { useTheme, styled } from '@material-ui/core/styles';
import { Box, Card, Stack, Divider, CardHeader, Typography } from '@material-ui/core';
// hooks
import useResponsive from 'hooks/useResponsive';
//
import { BaseOptionChart } from 'components/charts';
import { useActiveAccountStats } from 'hooks/account';
import { fCurrency } from 'utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  '& .apexcharts-legend': {
    width: 240,
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
      flexWrap: 'wrap',
      height: 160,
      width: '50%'
    }
  },
  '& .apexcharts-datalabels-group': {
    display: 'none'
  }
}));

// ----------------------------------------------------------------------

const TradeAllocation = () => {
  const theme = useTheme();
  const { trade_allocation_amounts, trade_allocation_categories } = useActiveAccountStats();

  const isDesktop = useResponsive('up', 'sm');

  const chartOptions = merge(BaseOptionChart(), {
    labels: trade_allocation_categories,
    colors: [
      theme.palette.primary.main,
      theme.palette.info.darker,
      theme.palette.chart.yellow[0],
      theme.palette.chart.blue[0],
      theme.palette.chart.red[0],
      theme.palette.chart.violet[2],
      theme.palette.chart.violet[0],
      theme.palette.success.darker,
      theme.palette.chart.green[0]
    ],
    dataLabels: {
      hideOverflowingLabels: true
    },
    stroke: {
      colors: [theme.palette.background.paper]
    },
    fill: { opacity: 0.8 },
    legend: {
      position: 'right',
      itemMargin: {
        horizontal: 10,
        vertical: 5
      }
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          legend: {
            position: 'bottom',
            horizontalAlign: 'left'
          }
        }
      }
    ]
  });

  return (
    <RootStyle>
      <CardHeader title="Trade Allocation" />

      <Box sx={{ my: 5 }} dir="ltr">
        <ReactApexChart
          type="polarArea"
          series={trade_allocation_amounts}
          options={chartOptions}
          height={isDesktop ? 240 : 360}
        />
      </Box>

      <Divider />

      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
        <Box sx={{ py: 2, width: 1, textAlign: 'center' }}>
          <Typography sx={{ mb: 1, typography: 'body2', color: 'text.secondary' }}>Categories</Typography>
          <Typography sx={{ typography: 'h4' }}>{trade_allocation_categories.length}</Typography>
        </Box>

        <Box sx={{ py: 2, width: 1, textAlign: 'center' }}>
          <Typography sx={{ mb: 1, typography: 'body2', color: 'text.secondary' }}>Total Amount</Typography>
          <Typography sx={{ typography: 'h4' }}>
            {fCurrency(trade_allocation_amounts.reduce((accumulator, currentValue) => accumulator + currentValue, 0))}
          </Typography>
        </Box>
      </Stack>
    </RootStyle>
  );
};

TradeAllocation.dimensions = {
  lg: { w: 4, h: 2, isResizable: true },
  md: { w: 4, h: 2, isResizable: true },
  sm: { w: 12, h: 2, isResizable: true },
  xs: { w: 12, h: 2, isResizable: true }
};

export default TradeAllocation;
