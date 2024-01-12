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
        key: 'invitation',
        icon: lockUnlock,
        external: null,
        path: 'invitation/:token',
        name: 'Invitation'
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
    path: 'terminal',
    name: 'Portal',
    children: [
      {
        key: 'analytics',
        icon: home,
        external: null,
        path: '/',
        name: 'Analytics'
      },
      {
        key: 'trades',
        icon: home,
        external: null,
        path: 'trades',
        name: 'Trades'
      },
      {
        key: 'settings',
        icon: home,
        external: null,
        path: 'settings',
        name: 'Settings'
      },
      {
        key: 'closed-trade',
        icon: lockUnlock,
        external: null,
        path: 'trades/closed-trade/:position',
        name: 'Closed Trades'
      },
      {
        key: 'manage-accounts',
        icon: lockUnlock,
        external: null,
        path: 'manage-accounts',
        name: 'Manage Accounts'
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
  },
  {
    key: 'landing',
    icon: global,
    external: null,
    path: '*',
    name: 'Landing',
    children: [
      {
        key: 'home',
        icon: home,
        external: null,
        path: '/',
        name: 'Home'
      },
      {
        key: 'contact-us',
        icon: global,
        external: null,
        path: 'contact-us',
        name: 'Contact Us'
      },
      {
        key: 'features',
        icon: global,
        external: null,
        path: 'features',
        name: 'Features'
      },
      {
        key: 'pricing',
        icon: global,
        path: 'pricing',
        external: null,
        name: 'Pricing'
      },
      {
        key: 'coming-soon',
        icon: home,
        external: null,
        path: 'coming-soon',
        name: 'Coming Soon'
      },
      {
        key: 'logout',
        icon: home,
        external: null,
        path: 'logout',
        name: 'Logout'
      },
      {
        key: '403',
        icon: home,
        external: null,
        path: '403',
        name: '403'
      },
      {
        key: '404',
        icon: home,
        external: null,
        path: '404',
        name: '404'
      },
      {
        key: '500',
        icon: home,
        external: null,
        path: '500',
        name: '500'
      }
    ]
  }
];

export default config;
