// @mui
import { styled } from '@material-ui/core/styles';
import { Box, Grid, Container, Typography } from '@material-ui/core';
// hooks
import useResponsive from 'hooks/useResponsive';
// components
import Page from 'components/Page';
// sections
import {
  PaymentSummary,
  PaymentMethods,
  PaymentBillingAddress,
  PaymentPackage,
  PaymentPackageSummary
} from './sections';
import { useState } from 'react';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100%',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------

export default function Payment({ handleClick }) {
  const isDesktop = useResponsive('up', 'md');

  return (
    <Page title="Payment">
      <RootStyle>
        <Container>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h3" align="center" paragraph>
              Let's finish powering you up!
            </Typography>
            <Typography align="center" sx={{ color: 'text.secondary' }}>
              Professional plan is right for you.
            </Typography>
          </Box>

          <Grid container spacing={isDesktop ? 3 : 5}>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: 'grid',
                  gap: 5,
                  p: { md: 5 },
                  borderRadius: 2,
                  border: (theme) => ({ md: `dashed 1px ${theme.palette.divider}` })
                }}
              >
                <PaymentPackage />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <PaymentPackageSummary />
            </Grid>
            <Grid item xs={12} md={4}>
              <PaymentSummary handleClick={handleClick} />
            </Grid>
          </Grid>
        </Container>
      </RootStyle>
    </Page>
  );
}
