import React, { useCallback, useContext, useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { useAuth } from 'models/Auth';
import { route, useFormRequest, useRequest } from 'services/Http';
import { useDispatch } from 'react-redux';
import { fetchUser } from 'store/slices/auth';
import EnableForm from './components/EnableForm';
import { LoadingButton } from '@material-ui/lab';
import { Alert, Box, Card, CardContent, CardHeader, Divider, Grid, Typography } from '@material-ui/core';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import Spin from 'components/Spin';
import Result from 'components/Result';
import Form from 'components/Form';
import StepContext from 'contexts/StepContext';
import { notify } from 'utils/index';
import TwoFactor from './two_factor';

const EnableTwoFactor = () => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const [form] = Form.useForm();
  const [url, setUrl] = useState('');
  const [formRequest, formLoading] = useFormRequest(form);
  const [request, loading] = useRequest();
  const { next } = useContext(StepContext);

  useEffect(() => {
    if (!auth.user.enabledTwoFactor()) {
      request
        .post(route('users.get-two-factor'))
        .then((data) => {
          setUrl(data.url);
        })
        .catch((error) => {
          if (error.response && error.response.data && !error.response.data._error_message) {
            const { data } = error.response;

            // Iterate over the fields in the error response
            Object.keys(data).forEach((fieldName) => {
              // Update the form with the field error
              form.setFields([
                {
                  name: fieldName,
                  errors: [data[fieldName][0]]
                }
              ]);
            });
          } else {
            notify.error(error.response.data._error_message);
          }
        });
    }
  }, [auth, request, form]);

  const submitForm = useCallback(
    (values) => {
      formRequest
        .post(route('users.set-two-factor'), values)
        .then(() => {
          dispatch(fetchUser());
        })
        .catch((error) => {
          if (error.response && error.response.data && !error.response.data._error_message) {
            const { data } = error.response;

            // Iterate over the fields in the error response
            Object.keys(data).forEach((fieldName) => {
              // Update the form with the field error
              form.setFields([
                {
                  name: fieldName,
                  errors: [data[fieldName][0]]
                }
              ]);
            });
          } else {
            notify.error(error.response.data._error_message);
          }
        });
    },
    [formRequest, dispatch]
  );

  const resetToken = useCallback(() => {
    request
      .post(route('users.get-two-factor'))
      .then((data) => {
        setUrl(data.url);
      })
      .catch((error) => {
        if (error.response && error.response.data && !error.response.data._error_message) {
          const { data } = error.response;

          // Iterate over the fields in the error response
          Object.keys(data).forEach((fieldName) => {
            // Update the form with the field error
            form.setFields([
              {
                name: fieldName,
                errors: [data[fieldName][0]]
              }
            ]);
          });
        } else {
          notify.error(error.response.data._error_message);
        }
      });
  }, [request]);

  return !auth.user.enabledTwoFactor() ? (
    <Spin spinning={loading}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <CodeBox component={QRCode} value={url} renderAs="svg" />

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                color: 'text.secondary',
                my: 2,
                mx: 'auto'
              }}
            >
              Scan this code with your preferred, authenticator app.
            </Typography>

            <LoadingButton variant="outlined" onClick={resetToken} loading={loading}>
              Reset Token
            </LoadingButton>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              To enable multi-factor authentication with time-based one time password (TOTP) generation, register your
              mobile device:
            </Alert>

            <Typography paragraph>
              Install an authenticator app such as <b>Google Authenticator</b> or <b>Authy</b>
            </Typography>

            <Typography paragraph gutterBottom>
              Scan the barcode on the left hand side
            </Typography>

            <Divider sx={{ my: 3 }}>Verification</Divider>

            <Typography paragraph gutterBottom>
              Enter the verification code generated on your authenticator app.
            </Typography>

            <EnableForm loading={formLoading} onFinish={submitForm} form={form} />
          </Card>
        </Grid>
      </Grid>
    </Spin>
  ) : (
    <Card>
      <CardHeader title="Two Factor" />

      <CardContent>
        <Result
          title="Two Factor Enabled!"
          description="You have enabled two factor."
          icon={TwoFactor}
          extra={
            <LoadingButton variant="contained" onClick={() => next()} loading={loading}>
              Next
            </LoadingButton>
          }
        />
      </CardContent>
    </Card>
  );
};

const CodeBox = styled(Box)(({ theme }) => ({
  maxWidth: '256px',
  width: '80%',
  height: 'auto',
  margin: 'auto',
  borderRadius: '5px',
  padding: theme.spacing(1),
  border: `1px dashed ${theme.palette.grey[500_32]}`
}));

export default EnableTwoFactor;
