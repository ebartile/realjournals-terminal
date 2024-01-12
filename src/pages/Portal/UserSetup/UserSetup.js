import React, { useCallback, useEffect, useMemo, useState } from 'react';
import StepContent from 'components/StepContent';
import VerifyEmail from './components/VerifyEmail';
import { fetchUser } from 'store/slices/auth';
import { useDispatch } from 'react-redux';
import Page from 'components/Page';
import { Box, Container, Grid, Step, StepLabel, Stepper } from '@material-ui/core';
import EnableTwoFactor from './components/EnableTwoFactor';
import UpdateProfile from './components/UpdateProfile';
import StepIcon from 'components/StepIcon';
import StepConnector from 'components/StepConnector';
import { StepProvider } from 'contexts/StepContext';
import { useAuth } from 'models/Auth';
import { useTheme } from '@material-ui/core/styles';

const UserSetup = () => {
  const auth = useAuth();
  const user = auth.user;
  const theme = useTheme();
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(user.hasVerifiedEmail() ? 1 : 0);
  // const [current, setCurrent] = useState(user.hasVerifiedEmail() ? (user.two_factor_enabled ? 2 : 1) : 0);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const next = useCallback(() => {
    setCurrent((c) => c + 1);
  }, [setCurrent]);

  const steps = useMemo(
    () => [
      {
        label: 'Verify Email',
        component: <VerifyEmail />
      },
      // {
      //   label: 'Enable Two Factor',
      //   component: <EnableTwoFactor />
      // },
      {
        label: 'Update Profile',
        component: <UpdateProfile />
      }
    ],
    []
  );

  return (
    <Page title="Account Setup| Real Journals">
      <Container>
        <Grid sx={{ paddingTop: theme.spacing(15) }} container spacing={5} justifyContent="center">
          <Grid item xs={12} md={8}>
            <Stepper alternativeLabel connector={<StepConnector />} activeStep={current}>
              {steps.map((step, key) => (
                <Step key={key}>
                  <StepLabel
                    StepIconComponent={StepIcon}
                    sx={{
                      '& .MuiStepLabel-label': {
                        typography: 'subtitle2',
                        color: 'text.disabled'
                      }
                    }}
                  >
                    {step.label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>

          <Grid item xs={12} md={8}>
            <StepProvider next={next}>
              <StepContent current={current}>
                {steps.map((step, key) => (
                  <Box key={key} component="div">
                    {step.component}
                  </Box>
                ))}
              </StepContent>
            </StepProvider>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default UserSetup;
