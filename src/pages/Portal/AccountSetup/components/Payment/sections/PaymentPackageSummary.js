// @mui
import { styled } from '@material-ui/core/styles';
import { Switch, Divider, Typography, Stack, Box } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// components
import Label from 'components/Label';
import Iconify from 'components/Iconify';
import { useState } from 'react';
import { MIconButton } from 'components/@material-extend';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
import { PACKAGE_OPTIONS } from './PaymentPackage';
import checkmarkFill from '@iconify/icons-eva/checkmark-fill';
import { Icon } from '@iconify/react';
import { useSubscription } from 'hooks/global';

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

export default function PaymentPackageSummary() {
  const subscription = useSubscription();
  const selectedOption = PACKAGE_OPTIONS.find((option) => option.value === subscription);

  return (
    <RootStyle>
      <Typography variant="subtitle1" sx={{ mb: 5 }}>
        Features
      </Typography>

      <Stack component="ul" spacing={2} sx={{ my: 5, width: 1 }}>
        {selectedOption.lists.map((item) => (
          <Stack
            key={item.text}
            component="li"
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ typography: 'body2', color: item.isAvailable ? 'text.primary' : 'text.disabled' }}
          >
            <Box component={Icon} icon={checkmarkFill} sx={{ width: 20, height: 20 }} />
            <Typography variant="body2">{item.text}</Typography>
          </Stack>
        ))}
      </Stack>
    </RootStyle>
  );
}
