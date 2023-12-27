import React, { useCallback, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
import { Box, Button, Container, Stack, Typography } from '@material-ui/core';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
import Page from 'components/Page';
import SentIcon from './SentIcon';
import CheckOut from './Checkout';
import router from 'router';
import ReCaptcha, { recaptchaSubmit } from 'components/ReCaptcha';
import { useRecaptcha } from 'hooks/settings';
import Form from 'components/Form';
import { LoadingButton } from '@material-ui/lab';
import { notify } from 'utils/index';
import { route, useFormRequest } from 'services/Http';
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import arrowBackOutline from '@iconify/icons-eva/arrow-back-outline';

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function CancelAccount() {
  const [form] = Form.useForm();
  const [formRequest, formLoading] = useFormRequest(form);
  const recaptcha = useRecaptcha();
  const recaptchaRef = useRef();
  const onSubmit = recaptchaSubmit(form, recaptchaRef);
  const [changed, setChanged] = useState(false);
  const { token } = useParams();

  const submitForm = useCallback(
    (values) => {
      values.cancel_token = token;
      formRequest
        .post(route('auth.cancel-account'), values)
        .then(() => {
          notify.success("We're sorry you are leaving the Real Journals, we hope you enjoyed your stay ");
          setChanged(true);
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
    [formRequest, setChanged, token, form]
  );

  return (
    <RootStyle title="Cancel Account | Real Journals">
      <LogoOnlyLayout />

      <Container>
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>
          {changed ? (
            <Box sx={{ textAlign: 'center' }}>
              <CheckOut sx={{ mb: 2, mx: 'auto', height: 160 }} />

              <Typography variant="h3" paragraph>
                We're sorry you have left Real Journals, we hope you enjoyed your stay :)
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 5 }}>Click below to register again.</Typography>

              <Button
                fullWidth
                size="large"
                component={RouterLink}
                to={router.generatePath('auth.register')}
                sx={{ mt: 1 }}
              >
                <Icon icon={arrowBackOutline} style={{ marginRight: '8px' }} />
                Register Again
              </Button>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <SentIcon sx={{ mb: 2, mx: 'auto', height: 160 }} />

              <Typography variant="h3" gutterBottom>
                YOUR JOURNAL AND TRADE MANAGEMENT TOOL
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 5 }}>Cancel your account</Typography>
              <Typography>We're sorry you are leaving Real Journals, we hope you enjoyed your stay :)</Typography>

              <Form form={form} onFinish={submitForm}>
                <Stack spacing={3}>
                  {recaptcha.enable && (
                    <Form.Item rules={[{ required: true }]} name="recaptcha">
                      <ReCaptcha ref={recaptchaRef} />
                    </Form.Item>
                  )}

                  <LoadingButton fullWidth variant="contained" loading={formLoading} size="large" onClick={onSubmit}>
                    Yes I Am Leaving
                  </LoadingButton>
                </Stack>
              </Form>

              <Button
                fullWidth
                size="large"
                component={RouterLink}
                to={router.generatePath('auth.forgot-password')}
                sx={{ mt: 1 }}
              >
                <Icon icon={arrowBackOutline} style={{ marginRight: '8px' }} />
                Return to Sign in
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </RootStyle>
  );
}
