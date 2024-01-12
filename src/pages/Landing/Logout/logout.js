import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
import { Box, Button, Container, Typography } from '@material-ui/core';
import Page from 'components/Page';
import router from 'router';
import { notify } from 'utils/index';
import { route, useFormRequest } from 'services/Http';
import { Icon } from '@iconify/react';
import arrowBackOutline from '@iconify/icons-eva/arrow-back-outline';
import LogoOnlyLayout from 'pages/Auth/layouts/LogoOnlyLayout';
import CheckOut from 'pages/Auth/VerifyEmail/Checkout';
import { LogoutUser, resetAuth } from 'store/slices/auth';
import { useDispatch } from 'react-redux';
import { resetAccount } from 'store/slices/account';
import { resetBrokers } from 'store/slices/brokers';
import { resetCalendar } from 'store/slices/calendar';
import { resetGlobal } from 'store/slices/global';

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function LogoutView() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetGlobal());
    dispatch(resetAccount());
    dispatch(resetAuth());
    dispatch(resetBrokers());
    dispatch(resetCalendar());
    dispatch(LogoutUser());
  }, [dispatch]);

  return (
    <RootStyle title="Logout | Real Journals">
      <LogoOnlyLayout />

      <Container>
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CheckOut sx={{ mb: 2, mx: 'auto', height: 160 }} />

            <Typography variant="h3" paragraph>
              Thanks for using our service. See you soon.
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 5 }}>Click below to login.</Typography>

            <Button fullWidth size="large" component={RouterLink} to={router.generatePath('auth.login')} sx={{ mt: 1 }}>
              <Icon icon={arrowBackOutline} style={{ marginRight: '8px' }} />
              Return to Sign in
            </Button>
          </Box>
        </Box>
      </Container>
    </RootStyle>
  );
}
