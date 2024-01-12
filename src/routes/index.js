import { Suspense, lazy, useContext, useEffect } from 'react';
import LoadingScreen from 'components/LoadingScreen';
import { useAuth } from 'models/Auth';
import { useDispatch } from 'react-redux';
import Middleware from 'components/Middleware';
import {
  auth as authRule,
  can,
  guest as guestRule,
  requireUserSetup,
  withoutUserSetup,
  requireAccountSetup,
  withoutAccountSetup
} from 'utils/middleware';
import { notify } from 'utils/index';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
import DashboardLayout from 'pages/Portal/layouts/dashboard';
import LogoOnlyLayout from 'pages/Portal/layouts/LogoOnlyLayout';
import context from 'context';
import { useRedirectPath } from 'redirect';
import { useAccountSelector, useActiveAccount } from 'hooks/account';
import { fetchAccounts, setActiveAccount } from 'store/slices/account';
import MainLayout from 'pages/Landing/layout';
import { fetchUser } from 'store/slices/auth';
import { useTokens } from 'hooks/global';
import axios from 'axios';
import { fetchSettings } from 'store/slices/settings';
import useSettings from 'hooks/useSettings';
import { useCrsfToken } from 'hooks/settings';

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

// Auth
const LoginPage = Loadable(lazy(() => import('../pages/Auth/Login')));
const RegisterPage = Loadable(lazy(() => import('../pages/Auth/Register')));
const ForgotPasswordPage = Loadable(lazy(() => import('../pages/Auth/ForgotPassword')));
const VerifyEmailPage = Loadable(lazy(() => import('../pages/Auth/VerifyEmail')));
const ChangePasswordPage = Loadable(lazy(() => import('../pages/Auth/ChangePassword')));
const ChangeEmailPage = Loadable(lazy(() => import('../pages/Auth/ChangeEmail')));
const CancelAccountPage = Loadable(lazy(() => import('../pages/Auth/CancelAccount')));
const InvitationPage = Loadable(lazy(() => import('../pages/Auth/Invitation')));

// Status
const ComingSoon = Loadable(lazy(() => import('../pages/Status/ComingSoon')));
const Maintenance = Loadable(lazy(() => import('../pages/Status/Maintenance')));
const Page500 = Loadable(lazy(() => import('../pages/Status/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Status/Page404')));
const Page403 = Loadable(lazy(() => import('../pages/Status/Page403')));

// Portal
const AccountSetupPage = Loadable(lazy(() => import('../pages/Portal/AccountSetup')));
const UserSetupPage = Loadable(lazy(() => import('../pages/Portal/UserSetup')));

// Dashboard
const ManageAccountsPage = Loadable(lazy(() => import('../pages/Portal/ManageAccounts')));
const DashboardPage = Loadable(lazy(() => import('../pages/Portal/Home')));
const TradesPage = Loadable(lazy(() => import('../pages/Portal/Trades')));
const ClosedTradeDetailsPage = Loadable(lazy(() => import('../pages/Portal/ClosedTradeDetails')));
const SettingsPage = Loadable(lazy(() => import('../pages/Portal/Settings')));

// Landing
const HomePage = Loadable(lazy(() => import('../pages/Landing/Home')));
const ContactUsPage = Loadable(lazy(() => import('../pages/Landing/ContactUs')));
const FeaturesPage = Loadable(lazy(() => import('../pages/Landing/Features')));
const PricingPage = Loadable(lazy(() => import('../pages/Landing/Pricing')));
const LogoutPage = Loadable(lazy(() => import('../pages/Landing/Logout')));

export default function Router() {
  const auth = useAuth();
  const { search } = useLocation();
  const { setPath } = useRedirectPath();
  const dispatch = useDispatch();
  const { access_token, refresh_token, auth_token } = useTokens();
  const crsf_token = useCrsfToken();

  useEffect(() => {
    if (access_token && !window.location.pathname.includes('logout')) {
      axios.defaults.withCredentials = true;
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      dispatch(fetchSettings());
      dispatch(fetchUser());
      dispatch(fetchAccounts());
    } else if (auth_token && !window.location.pathname.includes('logout')) {
      axios.defaults.withCredentials = true;
      axios.defaults.headers.common['Authorization'] = `BearerToken ${auth_token}`;
      dispatch(fetchSettings());
      dispatch(fetchUser());
      dispatch(fetchAccounts());
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }

    const queryParams = new URLSearchParams(search);
    const redirect = queryParams.get('redirect');

    if (redirect) {
      setPath(redirect);
    }
  }, [dispatch, search, access_token, auth_token]);

  useAccountSelector();

  useEffect(() => {
    if (crsf_token) {
      axios.defaults.headers.common['X-CSRFToken'] = crsf_token;
    } else {
      delete axios.defaults.headers.common['X-CSRFToken'];
    }
  }, [crsf_token]);

  return useRoutes([
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: 'maintenance', element: <Maintenance /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: '403', element: <Page403 /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    {
      path: 'account-setup',
      element: (
        <Middleware rules={[authRule('auth.login')]}>
          <LogoOnlyLayout />
        </Middleware>
      ),
      children: [
        {
          path: '',
          element: <AccountSetupPage />
        },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    {
      path: 'user-setup',
      element: (
        <Middleware rules={[authRule('auth.login'), withoutUserSetup()]}>
          <LogoOnlyLayout />
        </Middleware>
      ),
      children: [
        {
          path: '',
          element: <UserSetupPage />
        },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    {
      path: 'terminal',
      element: (
        <Middleware rules={[authRule('auth.login'), requireUserSetup(), requireAccountSetup()]}>
          <DashboardLayout />
        </Middleware>
      ),
      children: [
        { path: '', element: <DashboardPage /> },
        { path: 'manage-accounts', element: <ManageAccountsPage /> },
        { path: 'settings', element: <SettingsPage /> },
        { path: 'trades', element: <TradesPage /> },
        { path: 'trades/closed-trade/:position', element: <ClosedTradeDetailsPage /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: 'contact-us', element: <ContactUsPage /> },
        { path: 'features', element: <FeaturesPage /> },
        { path: 'logout', element: <LogoutPage /> },
        { path: 'pricing', element: <PricingPage /> }
      ]
    },
    {
      path: '*',
      children: [
        {
          path: 'login',
          element: (
            <Middleware rules={guestRule('terminal-portal.analytics')}>
              <LoginPage />
            </Middleware>
          )
        },
        {
          path: 'register',
          element: (
            <Middleware rules={guestRule('terminal-portal.analytics')}>
              <RegisterPage />
            </Middleware>
          )
        },
        {
          path: 'forgot-password',
          element: (
            <Middleware rules={guestRule('terminal-portal.analytics')}>
              <ForgotPasswordPage />
            </Middleware>
          )
        },
        {
          path: 'verify-email/:token',
          element: <VerifyEmailPage />
        },
        {
          path: 'invitation/:token',
          element: <InvitationPage />
        },
        {
          path: 'change-password/:token',
          element: <ChangePasswordPage />
        },
        {
          path: 'change-email/:token',
          element: <ChangeEmailPage />
        },
        {
          path: 'cancel-account/:token',
          element: <CancelAccountPage />
        },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
