// components
import SvgIconStyle from 'components/SvgIconStyle';
import router from 'router';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/static/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard')
};

const navConfig = [
  {
    subheader: 'general',
    items: [
      { title: 'dashboard', path: router.generatePath('terminal-portal.dashboard'), icon: ICONS.dashboard },
      { title: 'journal', path: router.generatePath('terminal-portal.trades'), icon: ICONS.invoice },
      { title: 'calendar', path: router.generatePath('terminal-portal.calendar'), icon: ICONS.invoice }
    ]
  }
];

export default navConfig;
