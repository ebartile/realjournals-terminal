import { memo } from 'react';
// @mui
import { styled } from '@material-ui/core/styles';
import { Container, AppBar } from '@material-ui/core';
// config
import { HEADER } from 'config';
// components
import { NavSectionHorizontal } from 'components/nav-section';
//
import SvgIconStyle from 'components/SvgIconStyle';
import { useAuth } from 'models/Auth';
import router from 'router';

// ----------------------------------------------------------------------

const RootStyle = styled(AppBar)(({ theme }) => ({
  transition: theme.transitions.create('top', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  width: '100%',
  position: 'fixed',
  zIndex: theme.zIndex.appBar,
  padding: theme.spacing(1, 0),
  boxShadow: theme.customShadows.z8,
  top: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
  backgroundColor: theme.palette.background.default
}));

// ----------------------------------------------------------------------

function NavbarHorizontal() {
  const getIcon = (name) => <SvgIconStyle src={`/static/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;
  const auth = useAuth();
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
    settings: getIcon('ic_kanban'),
    calendar: getIcon('ic_calendar'),
    ecommerce: getIcon('ic_ecommerce'),
    analytics: getIcon('ic_analytics'),
    logout: getIcon('ic_power')
  };

  const navConfig = [
    {
      subheader: 'general',
      items: [
        {
          title: 'analytics',
          path: router.generatePath('terminal-portal.analytics'),
          icon: ICONS.analytics
        },
        { title: 'journal', path: router.generatePath('terminal-portal.trades'), icon: ICONS.invoice },
        { title: 'settings', path: router.generatePath('terminal-portal.settings'), icon: ICONS.settings },
        { title: 'logout', path: router.generatePath('landing.logout'), icon: ICONS.logout }
      ]
    }
  ];

  return (
    <RootStyle>
      <Container maxWidth={false}>
        <NavSectionHorizontal navConfig={navConfig} />
      </Container>
    </RootStyle>
  );
}

export default memo(NavbarHorizontal);
