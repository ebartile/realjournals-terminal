import React from 'react';
import ResponsiveWidgets from './components/ResponsiveWidgets';
import widgets from './widgets';
import Page from 'components/Page';
import useSettings from 'hooks/useSettings';
import { Container } from '@material-ui/core';
import { useAuth } from 'models/Auth';

const Home = () => {
  const auth = useAuth();
  const { themeStretch } = useSettings();

  return (
    <Page title="Dashboard | Real Journals">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <ResponsiveWidgets widgets={widgets} page="terminal.dashboard" />
      </Container>
    </Page>
  );
};

export default Home;
