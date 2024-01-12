// @mui
import { styled } from '@material-ui/core/styles';
import { Switch, Divider, Typography, Stack, Icon } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// components
import Label from 'components/Label';
import Iconify from 'components/Iconify';
import { useState } from 'react';
import { MIconButton } from 'components/@material-extend';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
import { PACKAGE_OPTIONS } from './PaymentPackage';
import { useIsMonthly, useSubscription } from 'hooks/global';
import { setIsMonthly } from 'store/slices/global';
import { useDispatch } from 'react-redux';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(5),
  backgroundColor: theme.palette.background.neutral,
  borderRadius: Number(theme.shape.borderRadius) * 2
}));

const IncrementerStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.5, 0.75),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.grey[500_32]}`
}));

// ----------------------------------------------------------------------

export default function PaymentSummary({ handleClick }) {
  const dispatch = useDispatch();
  const subscription = useSubscription();
  const isMonthly = useIsMonthly();
  const selectedOption = PACKAGE_OPTIONS.find((option) => option.value === subscription);
  const price = selectedOption.price;
  const handleSwitchChange = (event) => {
    dispatch(setIsMonthly(event.target.checked));
  };

  return (
    <RootStyle>
      <Typography variant="subtitle1" sx={{ mb: 5 }}>
        Summary
      </Typography>

      <Stack spacing={2.5}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle2" component="p" sx={{ color: 'text.secondary' }}>
            Subscription
          </Typography>
          <Label color="error" variant="filled">
            {subscription.toUpperCase()}
          </Label>
        </Stack>

        {subscription == 'professional' && (
          <>
            <Stack direction="row" justifyContent="space-between">
              <Typography component="p" variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Billed {isMonthly ? 'Yearly' : 'Monthly'}
              </Typography>
              <Switch checked={isMonthly} onChange={handleSwitchChange} />
            </Stack>

            <Stack direction="row" justifyContent="flex-end">
              <Typography sx={{ color: 'text.secondary' }}>$</Typography>
              <Typography variant="h2" sx={{ mx: 1 }}>
                {price === 0 ? 'Free' : isMonthly ? (price * 0.9).toFixed(0) : price.toFixed(0)}
              </Typography>
              <Typography
                component="span"
                variant="body2"
                sx={{ mb: 1, alignSelf: 'flex-end', color: 'text.secondary' }}
              >
                /mo
              </Typography>
            </Stack>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6" component="p">
                Total Billed
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>$</Typography>
              <Typography variant="h6" component="p">
                {price === 0 ? 'Free' : isMonthly ? (price * 0.9).toFixed(0) * 12 : price.toFixed(0)}
              </Typography>
            </Stack>

            <Divider sx={{ borderStyle: 'dashed', mb: 1 }} />
          </>
        )}
      </Stack>

      <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
        * Plus applicable taxes
      </Typography>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        sx={{ mt: 5, mb: 3 }}
        onClick={handleClick}
      >
        Continue
      </LoadingButton>

      <Stack alignItems="center" spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Iconify icon={'eva:shield-fill'} sx={{ width: 20, height: 20, color: 'primary.main' }} />
          <Typography variant="subtitle2">Secure payments</Typography>
        </Stack>
        <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          This is a secure 128-bit SSL encrypted payment
        </Typography>
      </Stack>
    </RootStyle>
  );
}
