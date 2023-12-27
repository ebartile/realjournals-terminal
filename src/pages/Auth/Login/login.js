import React, { useCallback, useRef, useState } from 'react';
import { Navigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  Stack,
  Link,
  Checkbox,
  Divider,
  Container,
  Typography,
  Button,
  IconButton,
  InputAdornment
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { alpha, useTheme, styled } from '@material-ui/core/styles';
import Page from 'components/Page';
import { MHidden } from 'components/@material-extend';
import { Icon } from '@iconify/react';
import googleFill from '@iconify/icons-eva/google-fill';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import facebookFill from '@iconify/icons-eva/facebook-fill';
import AuthLayout from '../layouts/AuthLayout';
import { MotionInView } from 'components/animate';
import Form, { ControlLabel, TextField } from 'components/Form';
import { route, useFormRequest } from 'services/Http';
import { useAuth } from 'models/Auth';
import { useRecaptcha } from 'hooks/settings';
import ReCaptcha, { recaptchaSubmit } from 'components/ReCaptcha';
import router from 'router';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { notify } from 'utils';
import { useRedirectPath } from 'redirect';

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

const ScreenStyle = styled(MotionInView)(({ theme }) => ({
  paddingRight: 2,
  paddingBottom: 1,
  maxWidth: 160,
  borderRadius: 8,
  backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 300 : 800],
  [theme.breakpoints.up('sm')]: {
    maxWidth: 320,
    paddingRight: 4,
    borderRadius: 12
  },
  '& img': {
    borderRadius: 8,
    [theme.breakpoints.up('sm')]: {
      borderRadius: 12
    }
  }
}));

const COMMON = {
  scaleX: 0.86,
  skewY: 8,
  skewX: 0,
  scaleY: 1,
  translateX: 0,
  translateY: 0,
  opacity: 0
};

const variantScreenLeft = {
  initial: COMMON,
  animate: { ...COMMON, translateX: '-50%', translateY: 40, opacity: 1 }
};
const variantScreenCenter = {
  initial: COMMON,
  animate: { ...COMMON, opacity: 1 }
};
const variantScreenRight = {
  initial: COMMON,
  animate: { ...COMMON, translateX: '50%', translateY: -40, opacity: 1 }
};

export default function Login() {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const isRTL = theme.direction === 'rtl';

  const [form] = Form.useForm();
  const [request, loading] = useFormRequest(form);
  const auth = useAuth();
  const recaptchaRef = useRef();
  const recaptcha = useRecaptcha();
  const onSubmit = recaptchaSubmit(form, recaptchaRef);
  const [showPassword, setShowPassword] = useState(false);
  const screenLeftAnimate = variantScreenLeft;
  const screenCenterAnimate = variantScreenCenter;
  const screenRightAnimate = variantScreenRight;
  const { redirectPath } = useRedirectPath();

  const submitForm = useCallback(
    (values) => {
      request
        .post(route('auth.login'), values)
        .then((data) => {
          notify.success('Login was successful.');
          if (data.intended) {
            window.location.replace(data.intended);
          } else {
            window.location.href = router.generatePath('terminal-portal.dashboard');
          }
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
    [request, form]
  );

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <RootStyle title="Login | Real Journals">
      <AuthLayout>
        Don’t have an account? &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to={router.generatePath('auth.register')}>
          Get started
        </Link>
      </AuthLayout>

      <MHidden width="mdDown">
        <SectionStyle sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              justifyContent: 'center',
              width: '50%'
            }}
          >
            {[...Array(3)].map((_, index) => (
              <ScreenStyle
                key={index}
                threshold={0.72}
                variants={{
                  ...(index === 0 && screenLeftAnimate),
                  ...(index === 1 && screenCenterAnimate),
                  ...(index === 2 && screenRightAnimate)
                }}
                transition={{ duration: 0.72, ease: 'easeOut' }}
                sx={{
                  boxShadow: `${isRTL ? -80 : 80}px -40px 80px ${alpha(
                    isLight ? theme.palette.grey[600] : theme.palette.common.black,
                    0.48
                  )}`,
                  ...(index === 0 && {
                    zIndex: 3,
                    position: 'absolute'
                  }),
                  ...(index === 1 && { zIndex: 2 }),
                  ...(index === 2 && {
                    zIndex: 1,
                    position: 'absolute',
                    boxShadow: 'none'
                  })
                }}
              >
                <img
                  alt={`screen ${index + 1}`}
                  src={`/static/auth/screen_${isLight ? 'light' : 'dark'}_${index + 1}.png`}
                />
              </ScreenStyle>
            ))}
          </Box>
        </SectionStyle>
      </MHidden>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                Sign in to Real Journal
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Enter your details below.</Typography>
            </Box>
          </Stack>
          <Form form={form} onFinish={submitForm}>
            <Stack spacing={3}>
              <Form.Item name="email" rules={[{ required: true, type: 'email' }]} label="Email">
                <TextField fullWidth type="email" />
              </Form.Item>

              <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                <TextField
                  fullWidth
                  autoComplete="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
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

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ my: 2 }}>
                <Form.Item name="remember" valuePropName="checked" initialValue={true} label="Remember me">
                  <ControlLabel>
                    <Checkbox />
                  </ControlLabel>
                </Form.Item>

                <Link component={RouterLink} to={router.generatePath('auth.forgot-password')} variant="subtitle2">
                  Forgot password?
                </Link>
              </Stack>

              {recaptcha.enable && (
                <Form.Item rules={[{ required: true }]} name="recaptcha">
                  <ReCaptcha ref={recaptchaRef} />
                </Form.Item>
              )}

              <LoadingButton fullWidth variant="contained" size="large" onClick={onSubmit} loading={loading}>
                Login
              </LoadingButton>
            </Stack>
          </Form>

          <>
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography>
            </Divider>

            <Stack direction="row" spacing={2}>
              <Button
                fullWidth
                size="large"
                color="inherit"
                variant="outlined"
                href="https://api.realjournals.com/social-auth/login/google-oauth2/"
              >
                <Icon icon={googleFill} color="#DF3E30" height={24} />
              </Button>

              {/* <Button
                fullWidth
                size="large"
                color="inherit"
                variant="outlined"
                href="https://api.realjournals.com/social-auth/login/facebook/"
              >
                <Icon icon={facebookFill} color="#1877F2" height={24} />
              </Button>

              <Button
                fullWidth
                size="large"
                color="inherit"
                variant="outlined"
                href="https://api.realjournals.com/social-auth/login/twitter/"
              >
                <Icon icon={twitterFill} color="#1C9CEA" height={24} />
              </Button> */}
            </Stack>
          </>

          <MHidden width="smUp">
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Don’t have an account?&nbsp;
              <Link variant="subtitle2" component={RouterLink} to="/">
                Get started
              </Link>
            </Typography>
          </MHidden>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
