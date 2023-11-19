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
import { useAccountSelector } from 'hooks/account';
import { fetchAccounts } from 'redux/slices/account';

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/portal');

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

// Status
const ComingSoon = Loadable(lazy(() => import('../pages/Status/ComingSoon')));
const Maintenance = Loadable(lazy(() => import('../pages/Status/Maintenance')));
const Page500 = Loadable(lazy(() => import('../pages/Status/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Status/Page404')));
const Page403 = Loadable(lazy(() => import('../pages/Status/Page403')));

// Portal
const AccountSetupPage = Loadable(lazy(() => import('../pages/Portal/accountSetup')));

// Dashboard
const DashboardPage = Loadable(lazy(() => import('../pages/Portal/home')));

export default function Router() {
  const isMaintaince = context.maintaince;
  const isComingSoon = context.comingsoon;
  const { search } = useLocation();
  const { setPath } = useRedirectPath();
  const dispatch = useDispatch();
  useAccountSelector();

  useEffect(() => {
    dispatch(fetchAccounts());

    const queryParams = new URLSearchParams(search);
    const redirect = queryParams.get('redirect');

    if (redirect) {
      setPath(redirect);
    }
    const data = context.notification;
    notify[data?.type]?.(data.message);
  }, [search, dispatch]);

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
      path: 'setup',
      element: (
        <Middleware rules={[authRule('auth.login'), withoutAccountSetup()]}>
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
      path: '*',
      element: (
        <Middleware rules={[authRule('auth.login'), requireUserSetup(), requireAccountSetup()]}>
          <DashboardLayout />
        </Middleware>
      ),
      children: [
        { path: '', element: <DashboardPage /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
