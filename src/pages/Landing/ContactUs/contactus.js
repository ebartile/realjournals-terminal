import { styled } from '@material-ui/core/styles';
import { Grid, Container, Card } from '@material-ui/core';
import Page from 'components/Page';
import ContactWelcome from './ContactWelcome';
import ContactHero from './ContactHero';

const RootStyle = styled(Page)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(11)
  }
}));

export default function ContactUs() {
  return (
    <RootStyle title="Contact Us | Real Journals">
      <ContactWelcome />
      <ContactHero />
    </RootStyle>
  );
}
