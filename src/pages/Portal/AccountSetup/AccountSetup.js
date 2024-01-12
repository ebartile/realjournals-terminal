import React, { useCallback, useEffect, useMemo, useState } from 'react';
import StepContent from 'components/StepContent';
import { useDispatch } from 'react-redux';
import Page from 'components/Page';
import { Box, Button, Container, Grid, Step, StepLabel, Stepper } from '@material-ui/core';
import StepIcon from 'components/StepIcon';
import StepConnector from 'components/StepConnector';
import { StepProvider } from 'contexts/StepContext';
import { useAuth } from 'models/Auth';
import { useTheme } from '@material-ui/core/styles';
import ImportData from './components/ImportData';
import Payment from './components/Payment/Payment';
import Iconify from 'components/Iconify';
import { useNavigate } from 'react-router';
import router from 'router/router';

const AccountSetup = () => {
  const auth = useAuth();
  const user = auth.user;
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => c + 1);
  }, [setCurrent]);

  const back = useCallback(() => {
    setCurrent((c) => {
      if (c == 0) {
        return navigate(router.generatePath('terminal-portal.analytics'));
      } else {
        return c - 1;
      }
    });
  }, [setCurrent]);

  const steps = useMemo(
    () => [
      {
        label: 'Billing',
        component: <Payment handleClick={next} />
      },
      {
        label: 'Create Account',
        component: <ImportData />
      }
    ],
    []
  );

  return (
    <Page title="Account Setup| Real Journals">
      <Container>
        <Grid sx={{ paddingTop: theme.spacing(15) }} container spacing={5} justifyContent="center">
          <Grid item xs={12} md={12}>
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
            <Button
              size="small"
              color="inherit"
              onClick={back}
              startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}
            >
              Back
            </Button>
          </Grid>

          <Grid item xs={12} md={12}>
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

export default AccountSetup;
