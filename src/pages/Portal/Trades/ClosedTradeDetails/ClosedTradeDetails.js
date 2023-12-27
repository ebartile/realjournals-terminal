import { useParams } from 'react-router-dom';
import { Container } from '@material-ui/core';
import useSettings from 'hooks/useSettings';
import Page from 'components/Page';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'lodash';
import router from 'router/router';
import ClosedTradeDetail from './ClosedTradeDetail';

export default function ClosedTradeDetails() {
  const { themeStretch } = useSettings();

  const { position } = useParams();
  console.log(position);

  return (
    <Page title="Ticket: View">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Ticket Details"
          links={[
            { name: 'Dashboard', href: router.generatePath('terminal-portal.dashboard') },
            { name: 'Trades', href: router.generatePath('terminal-portal.trades') },
            { name: position || '' }
          ]}
        />

        <ClosedTradeDetail position={parseInt(position)} />
      </Container>
    </Page>
  );
}
