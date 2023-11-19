import React, { useCallback, useEffect, useMemo, useState } from 'react';
import StepContent from 'components/StepContent';
import { useDispatch } from 'react-redux';
import Page from 'components/Page';
import { Box, Container, Grid, Step, StepLabel, Stepper } from '@material-ui/core';
import StepIcon from 'components/StepIcon';
import StepConnector from 'components/StepConnector';
import { StepProvider } from 'contexts/StepContext';
import CreateAccount from './components/CreateAccount';
import { useAuth } from 'models/Auth';
import { useTheme } from '@material-ui/core/styles';
import ImportData from './components/ImportData';

const AccountSetup = () => {
  const auth = useAuth();
  const user = auth.user;
  const theme = useTheme();
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(user.has_account ? 1 : 0);

  const next = useCallback(() => {
    setCurrent((c) => c + 1);
  }, [setCurrent]);

  const steps = useMemo(
    () => [
      {
        label: 'Create Trade Account',
        component: <CreateAccount />
      },
      {
        label: 'Import Data',
        component: <ImportData />
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

export default AccountSetup;
