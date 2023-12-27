import router from 'router/router';
// @mui
import { useTheme } from '@material-ui/core/styles';
import useSettings from 'hooks/useSettings';
// components
import Page from 'components/Page';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Calendar from '../Home/components/Calendar';
import { Card, Container } from '@material-ui/core';

// ----------------------------------------------------------------------

export default function Calandar() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Trade: Calendar">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Trade Calendar"
          links={[
            { name: 'Dashboard', href: router.generatePath('terminal-portal.dashboard') },
            { name: 'Trades', href: router.generatePath('terminal-portal.trades') },
            { name: 'Calendar', href: router.generatePath('terminal-portal.calendar') }
          ]}
        />

        <Card>
          <Calendar />
        </Card>
      </Container>
    </Page>
  );
}
