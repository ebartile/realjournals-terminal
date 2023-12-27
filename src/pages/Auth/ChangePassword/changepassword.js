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

export default function ChangePassword() {
  const [form] = Form.useForm();
  const [formRequest, formLoading] = useFormRequest(form);
  const [changed, setChanged] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const recaptcha = useRecaptcha();
  const recaptchaRef = useRef();
  const onSubmit = recaptchaSubmit(form, recaptchaRef);
  const { token } = useParams();

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleShowPassword2 = () => {
    setShowPassword2((show) => !show);
  };

  const submitForm = useCallback(
    (values) => {
      values.token = token;
      formRequest
        .post(route('auth.change-password'), values)
        .then(() => {
          notify.success('Password was reset.');
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
    <RootStyle title="Change Password | Real Journals">
      <LogoOnlyLayout />

      <Container>
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>
          {changed ? (
            <Box sx={{ textAlign: 'center' }}>
              <CheckOut sx={{ mb: 2, mx: 'auto', height: 160 }} />

              <Typography variant="h3" paragraph>
                Congratulations! Your password has changed.
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
                Request to change password!
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 5 }}>
                Input your new password and confirm it. Thanks
              </Typography>

              <Form form={form} onFinish={submitForm}>
                <Stack spacing={3}>
                  <Form.Item name="password" label="New Password" rules={[{ required: true }]}>
                    <TextField
                      fullWidth
                      autoComplete="password"
                      type={showPassword ? 'text' : 'password'}
                      label="New Password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleShowPassword} edge="end">
                              <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="password2"
                    label="Confirm New Password"
                    rules={[passwordConfirmation('password'), { required: true }]}
                  >
                    <TextField
                      fullWidth
                      autoComplete="password"
                      type={showPassword2 ? 'text' : 'password'}
                      label="Confirm New Password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleShowPassword2} edge="end">
                              <Icon icon={showPassword2 ? eyeFill : eyeOffFill} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Form.Item>

                  {recaptcha.enable && (
                    <Form.Item rules={[{ required: true }]} name="recaptcha">
                      <ReCaptcha ref={recaptchaRef} />
                    </Form.Item>
                  )}

                  <LoadingButton fullWidth variant="contained" loading={formLoading} size="large" onClick={onSubmit}>
                    Update Password
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
