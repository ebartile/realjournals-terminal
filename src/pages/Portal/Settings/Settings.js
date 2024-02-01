import { capitalCase } from 'change-case';
import { Container, Tab, Box, Tabs } from '@material-ui/core';
import useTabs from 'hooks/useTabs';
import useSettings from 'hooks/useSettings';
import Page from 'components/Page';
import Iconify from 'components/Iconify';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import router from 'router/router';
import AccountGeneral from './AccountGeneral';
import AccountMembers from './AccountMembers';
import AccountBilling from './AccountBilling';
import AccountNotifications from './AccountNotifications';

export default function UserAccount() {
  const { themeStretch } = useSettings();

  const { currentTab, onChangeTab } = useTabs('general');

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <AccountGeneral />
    },
    {
      value: 'members',
      icon: <Iconify icon={'eva:share-fill'} width={20} height={20} />,
      component: <AccountMembers />
    }
    // {
    //   value: 'billing',
    //   icon: <Iconify icon={'ic:round-receipt'} width={20} height={20} />,
    //   component: <AccountBilling />
    // },
    // {
    //   value: 'notifications',
    //   icon: <Iconify icon={'eva:bell-fill'} width={20} height={20} />,
    //   component: <AccountNotifications />
    // }
  ];

  return (
    <Page title="Account Settings">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Account"
          links={[
            {
              name: 'Analytics',
              href: router.generatePath('terminal-portal.analytics')
            },
            { name: 'Settings' }
          ]}
        />

        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={currentTab}
          onChange={onChangeTab}
        >
          {ACCOUNT_TABS.map((tab) => (
            <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        <Box sx={{ mb: 5 }} />

        {ACCOUNT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
