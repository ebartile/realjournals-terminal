import React, { useCallback, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
import { Box, Button, Container, Stack, Typography, InputAdornment, IconButton } from '@material-ui/core';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
import Page from 'components/Page';
import SentIcon from './SentIcon';
import CheckOut from './Checkout';
import router from 'router';
import ReCaptcha, { recaptchaSubmit } from 'components/ReCaptcha';
import { useRecaptcha } from 'hooks/settings';
import Form, { TextField } from 'components/Form';
import { LoadingButton } from '@material-ui/lab';
import { notify } from 'utils/index';
import { route, useFormRequest } from 'services/Http';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Icon } from '@iconify/react';
import { passwordConfirmation } from 'utils/form';
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

export default function ChangeEmail() {
  const [form] = Form.useForm();
  const [formRequest, formLoading] = useFormRequest(form);
  const recaptcha = useRecaptcha();
  const recaptchaRef = useRef();
  const onSubmit = recaptchaSubmit(form, recaptchaRef, recaptcha);
  const [changed, setChanged] = useState(false);
  const { token } = useParams();

  const submitForm = useCallback(
    (values) => {
      values.email_token = token;
      formRequest
        .post(route('auth.change-email'), values)
        .then(() => {
          notify.success('Congratulations!!, Your email address has been successfully changed');
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
    <RootStyle title="Change Email Verification | Real Journals">
      <LogoOnlyLayout />

      <Container>
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>
          {changed ? (
            <Box sx={{ textAlign: 'center' }}>
              <CheckOut sx={{ mb: 2, mx: 'auto', height: 160 }} />

              <Typography variant="h3" paragraph>
                Congratulations!!, Your email address has been successfully changed
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 5 }}>Click below to login.</Typography>

              <Button
                fullWidth
                size="large"
                component={RouterLink}
                to={router.generatePath('auth.login')}
                sx={{ mt: 1 }}
              >
                <Icon icon={arrowBackOutline} style={{ marginRight: '8px' }} />
                Return to Sign in
              </Button>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <SentIcon sx={{ mb: 2, mx: 'auto', height: 160 }} />

              <Typography variant="h3" gutterBottom>
                Request to Change Email!
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 5 }}>Click Below to verify email</Typography>

              <Form form={form} onFinish={submitForm}>
                <Stack spacing={3}>
                  {recaptcha.enable && (
                    <Form.Item rules={[{ required: true }]} name="recaptcha">
                      <ReCaptcha ref={recaptchaRef} />
                    </Form.Item>
                  )}

                  <LoadingButton fullWidth variant="contained" loading={formLoading} size="large" onClick={onSubmit}>
                    Change Email
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
