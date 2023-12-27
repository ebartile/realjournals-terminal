import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  Radio,
  Stack,
  Link,
  Checkbox,
  Divider,
  Container,
  Typography,
  Button,
  RadioGroup,
  Tooltip,
  CardActionArea,
  FormControlLabel,
  IconButton,
  InputAdornment
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { capitalCase } from 'change-case';
import { motion } from 'framer-motion';
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
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import useSettings from 'hooks/useSettings';
import { notify } from 'utils';
import { passwordConfirmation } from 'utils/form';
import { useRedirectPath } from 'redirect';

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 664,
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

export default function Register() {
  const theme = useTheme();

  const [form] = Form.useForm();
  const [request, loading] = useFormRequest(form);
  const auth = useAuth();
  const recaptchaRef = useRef();
  const recaptcha = useRecaptcha();
  const onSubmit = recaptchaSubmit(form, recaptchaRef);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const { themeColor, colorOption } = useSettings();
  const [currentColor, setCurrentColor] = useState(themeColor);
  const { redirectPath } = useRedirectPath();

  useEffect(() => {
    const colorTimer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * colorOption.length);
      setCurrentColor(colorOption[randomIndex].name);
    }, 5000); // 5000 milliseconds (5 seconds)

    return () => {
      clearInterval(colorTimer); // Cleanup the interval when the component unmounts
    };
  }, [colorOption]);

  const submitForm = useCallback(
    (values) => {
      request
        .post(route('auth.register'), values)
        .then((data) => {
          notify.success('Registration was successful.');
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

  const handleShowPassword2 = () => {
    setShowPassword2((show) => !show);
  };

  return (
    <RootStyle title="Register | Real Journals">
      <AuthLayout>
        Already have an account? &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to={router.generatePath('auth.login')}>
          Login
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
                Get started absolutely free
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Free forever. No credit card needed.</Typography>
            </Box>
          </Stack>
          <>
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
              </Button> */}
              {/* 
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
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography>
            </Divider>
          </>

          <Form form={form} onFinish={submitForm}>
            <Stack spacing={3}>
              <Form.Item name="email" rules={[{ required: true, type: 'email' }]} label="Email">
                <TextField fullWidth type="email" />
              </Form.Item>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
                  <TextField fullWidth />
                </Form.Item>

                <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
                  <TextField fullWidth />
                </Form.Item>
              </Stack>

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

              <Form.Item
                name="password2"
                label="Confirm Password"
                rules={[passwordConfirmation('password'), { required: true }]}
              >
                <TextField
                  fullWidth
                  autoComplete="password"
                  type={showPassword2 ? 'text' : 'password'}
                  label="Confirm Password"
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

              <LoadingButton fullWidth variant="contained" size="large" onClick={onSubmit} loading={loading}>
                Create Account
              </LoadingButton>
            </Stack>
          </Form>

          <MHidden width="smUp">
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Already have an account? &nbsp;
              <Link underline="none" variant="subtitle2" component={RouterLink} to={router.generatePath('auth.login')}>
                Login
              </Link>
            </Typography>
          </MHidden>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
