import React, { useCallback, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
import { Box, Button, Stack, Container, Typography } from '@material-ui/core';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
import Page from 'components/Page';
import SentIcon from './SentIcon';
import router from 'router';
import ReCaptcha, { recaptchaSubmit } from 'components/ReCaptcha';
import { useRecaptcha } from 'hooks/settings';
import Form, { TextField } from 'components/Form';
import { LoadingButton } from '@material-ui/lab';
import { notify } from 'utils/index';
import { route, useFormRequest } from 'services/Http';

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const recaptcha = useRecaptcha();
  const recaptchaRef = useRef();
  const [form] = Form.useForm();
  const [formRequest, formLoading] = useFormRequest(form);
  const onSubmit = recaptchaSubmit(form, recaptchaRef);

  const submitForm = useCallback(
    (values) => {
      formRequest
        .post(route('auth.forgot-password'), values)
        .then(() => {
          setEmail(values.email);
          setSent(true);
          notify.success('Verification code was sent.');
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
    [form, formRequest, setEmail, setSent]
  );

  return (
    <RootStyle title="Reset Password | Real Journals">
      <LogoOnlyLayout />

      <Container>
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>
          {!sent ? (
            <Box sx={{ textAlign: 'center' }}>
              <Box
                component="img"
                alt="lock screen"
                src={'/static/auth/lock.svg'}
                sx={{ height: 120, mb: 3, width: '100%' }}
              />
              <Typography variant="h3" paragraph>
                Forgot your password?
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 5 }}>
                Please enter the email address associated with your account and We will email you a link to reset your
                password.
              </Typography>

              <Form form={form} onFinish={submitForm}>
                <Stack spacing={3}>
                  <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
                    <TextField type="email" id="recovery-email" fullWidth />
                  </Form.Item>

                  {recaptcha.enable && (
                    <Form.Item rules={[{ required: true }]} name="recaptcha">
                      <ReCaptcha ref={recaptchaRef} />
                    </Form.Item>
                  )}

                  <LoadingButton fullWidth variant="contained" loading={formLoading} size="large" onClick={onSubmit}>
                    Send Code
                  </LoadingButton>
                </Stack>
              </Form>

              <Button
                fullWidth
                size="large"
                component={RouterLink}
                to={router.generatePath('auth.login')}
                sx={{ mt: 1 }}
              >
                Back
              </Button>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <SentIcon sx={{ mb: 5, mx: 'auto', height: 160 }} />

              <Typography variant="h3" gutterBottom>
                Request sent successfully
              </Typography>
              <Typography>
                We sent you an email with the instructions to set a new password to &nbsp;
                <strong>{email}</strong>
                <br /> Please check your email.
              </Typography>

              <Button
                size="large"
                variant="contained"
                component={RouterLink}
                to={router.generatePath('auth.forgot-password')}
                sx={{ mt: 5 }}
              >
                Back
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </RootStyle>
  );
}
