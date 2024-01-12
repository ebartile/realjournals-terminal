import { useState } from 'react';
// @mui
import { styled } from '@material-ui/core/styles';
import {
  Stack,
  Paper,
  Radio,
  Button,
  Collapse,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel
} from '@material-ui/core';
// components
import Image from 'components/Image';
import Iconify from 'components/Iconify';
import { useDispatch } from 'react-redux';
import { setSubscription } from 'store/slices/global';
import { useSubscription } from 'hooks/global';

// ----------------------------------------------------------------------

const OptionStyle = styled(Paper)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2),
  transition: theme.transitions.create('all'),
  border: `solid 1px ${theme.palette.divider}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.5
}));

// ----------------------------------------------------------------------

export const PACKAGE_OPTIONS = [
  {
    value: 'free',
    title: 'Free',
    price: 0,
    lists: [
      { text: 'Analytics', isAvailable: true },
      { text: 'Manual Journaling', isAvailable: true },
      { text: 'Calendar', isAvailable: true },
      { text: 'Up to 5 followers', isAvailable: true },
      { text: 'Advanced security', isAvailable: true },
      { text: 'Permissions & workflows', isAvailable: true }
    ]
  },
  {
    value: 'professional',
    title: 'Professional',
    price: 10,
    lists: [
      { text: 'Analytics', isAvailable: true },
      { text: 'Automatated Journaling', isAvailable: true },
      { text: 'Calendar', isAvailable: true },
      { text: 'Unlimited Followers', isAvailable: true },
      { text: 'Advanced security', isAvailable: true },
      { text: 'Permissions & workflows', isAvailable: true }
    ]
  }
];

export default function PaymentMethods() {
  const dispatch = useDispatch();
  const subscription = useSubscription();

  const handleChangeMethod = (event) => {
    dispatch(setSubscription(event.target.value));
  };

  return (
    <div>
      <Typography variant="subtitle1" sx={{ mb: 5 }}>
        Select Package
      </Typography>

      <RadioGroup value={subscription} onChange={handleChangeMethod}>
        <Stack spacing={3}>
          {PACKAGE_OPTIONS.map((option) => {
            const { value, title, price } = option;

            const isSelected = subscription === value;

            return (
              <OptionStyle
                key={title}
                sx={{
                  ...(isSelected && {
                    boxShadow: (theme) => theme.customShadows.z20
                  })
                }}
              >
                <FormControlLabel
                  value={value}
                  control={<Radio checkedIcon={<Iconify icon={'eva:checkmark-circle-2-fill'} />} />}
                  label={
                    <Typography variant="subtitle2" sx={{ ml: 1 }}>
                      {title}
                    </Typography>
                  }
                  sx={{ py: 3, mx: 0 }}
                />

                <Stack
                  spacing={1}
                  direction="row"
                  alignItems="center"
                  sx={{ position: 'absolute', right: 20, top: 32 }}
                >
                  <Typography sx={{ color: 'text.secondary' }}>$</Typography>
                  <Typography variant="h6" sx={{ mx: 1 }}>
                    {price === 0 ? 'Free' : price.toFixed(0)}
                  </Typography>
                </Stack>
              </OptionStyle>
            );
          })}
        </Stack>
      </RadioGroup>
    </div>
  );
}
