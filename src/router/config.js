import lockPassword from '@iconify-icons/ri/lock-password-line';
import loginCircle from '@iconify-icons/ri/login-circle-line';
import lockUnlock from '@iconify-icons/ri/lock-unlock-line';
import userAdd from '@iconify-icons/ri/user-add-line';
import global from '@iconify-icons/ri/global-fill';
import home from '@iconify-icons/ri/home-7-fill';
import context from 'context';

const config = [
  {
    key: 'auth',
    icon: lockPassword,
    external: null,
    path: '*',
    name: 'Auth',
    children: [
      {
        key: 'login',
        icon: loginCircle,
        external: null,
        path: 'login',
        name: 'Login'
      },
      {
        key: 'forgot-password',
        icon: lockUnlock,
        external: null,
        path: 'forgot-password',
        name: 'Forgot Password'
      },
      {
        key: 'register',
        icon: userAdd,
        external: null,
        path: 'register',
        name: 'Register'
      },
      {
        key: 'change-password',
        icon: lockUnlock,
        external: null,
        path: 'change-password/:token',
        name: 'Change Password'
      },
      {
        key: 'verify-email',
        icon: lockUnlock,
        external: null,
        path: 'verify-email/:token',
        name: 'Verify Email'
      },
      {
        key: 'change-email',
        icon: lockUnlock,
        external: null,
        path: 'change-email/:token',
        name: 'Change Email'
      },
      {
        key: 'cancel-account',
        icon: lockUnlock,
        external: null,
        path: 'cancel-account/:token',
        name: 'Cancel Account'
      }
    ]
  },
  {
    key: 'terminal-portal',
    icon: global,
    external: null,
    path: '*',
    name: 'Portal',
    children: [
      {
        key: 'dashboard',
        icon: home,
        external: null,
        path: '/',
        name: 'Dashboard'
      },
      {
        key: 'trades',
        icon: home,
        external: null,
        path: 'trades',
        name: 'Trades'
      },
      {
        key: 'closed-trade',
        icon: lockUnlock,
        external: null,
        path: 'closed-trade/:position',
        name: 'Closed Trades'
      },
      {
        key: 'calendar',
        icon: home,
        external: null,
        path: 'calendar',
        name: 'Calendar'
      }
    ]
  },
  {
    key: 'user-setup',
    icon: global,
    external: null,
    path: 'user-setup/*',
    name: 'User Setup',
    children: [
      {
        key: 'steps',
        icon: home,
        external: null,
        path: '/',
        name: 'User Setup'
      }
    ]
  },
  {
    key: 'account-setup',
    icon: global,
    external: null,
    path: 'account-setup/*',
    name: 'Account Setup',
    children: [
      {
        key: 'steps',
        icon: home,
        external: null,
        path: '/',
        name: 'Account Setup'
      }
    ]
  }
];

export default config;
