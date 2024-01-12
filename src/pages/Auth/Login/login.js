import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Navigate, Link as RouterLink, useNavigate } from 'react-router-dom';
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
import { MotionInView, varFadeInUp, varFadeInDown } from 'components/animate';
import Form, { ControlLabel, TextField } from 'components/Form';
import { route, useFormRequest } from 'services/Http';
import { useAuth } from 'models/Auth';
import { useRecaptcha } from 'hooks/settings';
import ReCaptcha, { recaptchaSubmit } from 'components/ReCaptcha';
import router from 'router';
import { motion } from 'framer-motion';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { notify } from 'utils';
import { useRedirectPath } from 'redirect';
import GoogleLogin from 'react-google-login';
import { gapi } from 'gapi-script';
import { setAccessToken, setRefreshToken, setAuthToken } from 'store/slices/global';
import { setUser } from 'store/slices/auth';
import { useDispatch } from 'react-redux';
import useSettings from 'hooks/useSettings';

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
  const recaptcha = useRecaptcha();
  const recaptchaRef = useRef();
  const onSubmit = recaptchaSubmit(form, recaptchaRef, recaptcha);
  const [showPassword, setShowPassword] = useState(false);
  const screenLeftAnimate = variantScreenLeft;
  const screenCenterAnimate = variantScreenCenter;
  const screenRightAnimate = variantScreenRight;
  const { redirectPath } = useRedirectPath();
  const { themeColor, colorOption } = useSettings();
  const [currentColor, setCurrentColor] = useState(themeColor);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const colorTimer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * colorOption.length);
      setCurrentColor(colorOption[randomIndex].name);
    }, 5000); // 5000 milliseconds (5 seconds)

    return () => {
      clearInterval(colorTimer); // Cleanup the interval when the component unmounts
    };
  }, [colorOption]);

  const clientId = '884185272139-vlh8074gg07n3n5kigejkc0umb4dfvs9.apps.googleusercontent.com';

  const onSuccess = async (res) => {
    const user = {
      grant_type: 'convert_token',
      client_id: '28hY9aOV9EG5cMdbdrFgD5urIoV8WvtNBd1zLGm2',
      client_secret:
        'omUOn0A6nvQy6Ncuzyf9XzzkitZYbSvGEWLb0kZk4ecnBg0mrlz5EbdtnvT0kGH2QwQDaBKnjdblmkFXN7x1k73oXfBJTJ4PJolhj86Cs9B338gH05RgbnAFMXc9Dbvd',
      backend: 'google-oauth2',
      token: res.accessToken
    };
    request
      .post(route('auth.convert-token'), user)
      .then((data) => {
        notify.success('Login was successful.');
        dispatch(setAccessToken(data.access_token));
        dispatch(setRefreshToken(data.refresh_token));
      })
      .catch((error) => {
        if (error.response._error_message.includes('already exists')) {
          notify.error('Your account uses email and password.');
        }
      });
  };

  const onFailure = (err) => {
    notify.error('Login was unsuccessful:' + err.error);
  };

  const submitForm = useCallback(
    (values) => {
      request
        .post(route('auth.login'), values)
        .then((data) => {
          notify.success('Login was successful.');
          dispatch(setUser(data));
          dispatch(setAuthToken(data.auth_token));

          if (data.intended) {
            window.location.replace(data.intended);
          } else {
            navigate(router.generatePath('terminal-portal.analytics'));
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

  useEffect(() => {
    if (auth.user) {
      navigate(router.generatePath('terminal-portal.analytics', { username: data.username }));
    }
  }, [auth.user]);

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
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Manage your trades more effectively with Real Journals
          </Typography>
          <Box sx={{ position: 'relative' }}>
            <Box component="img" src="/static/home/theme-color/grid.png" />

            <Box sx={{ position: 'absolute', top: 0 }}>
              <MotionInView variants={varFadeInUp}>
                <img alt="screen" src={`/static/home/theme-color/screen-${currentColor}.png`} />
              </MotionInView>
            </Box>

            <Box sx={{ position: 'absolute', top: 0 }}>
              <MotionInView variants={varFadeInDown}>
                <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity }}>
                  <img alt="sidebar" src={`/static/home/theme-color/block1-${currentColor}.png`} />
                </motion.div>
              </MotionInView>
            </Box>

            <Box sx={{ position: 'absolute', top: 0 }}>
              <MotionInView variants={varFadeInDown}>
                <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 8, repeat: Infinity }}>
                  <img alt="sidebar" src={`/static/home/theme-color/block2-${currentColor}.png`} />
                </motion.div>
              </MotionInView>
            </Box>

            <Box sx={{ position: 'absolute', top: 0 }}>
              <MotionInView variants={varFadeInDown}>
                <motion.div animate={{ y: [-25, 5, -25] }} transition={{ duration: 10, repeat: Infinity }}>
                  <img alt="sidebar" src={`/static/home/theme-color/sidebar-${currentColor}.png`} />
                </motion.div>
              </MotionInView>
            </Box>
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

            <Stack direction="row" spacing={2} justifyContent="center">
              <GoogleLogin
                fullWidth
                clientId={clientId}
                size="large"
                color="inherit"
                variant="outlined"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
              />

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
