import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
import { Typography, Button, Card, CardContent, Container } from '@material-ui/core';
import Welcomeillustration from './Welcomeillustration';

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  backgroundColor: theme.palette.primary.lighter
}));

const ContentStyle = styled('div')(({ theme }) => ({
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    height: '100%',
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}));

// ----------------------------------------------------------------------

ContactWelcome.propTypes = {
  displayName: PropTypes.string
};

export default function ContactWelcome() {
  return (
    <RootStyle>
      <Container maxWidth="lg" sx={{ display: 'flex' }}>
        <ContentStyle>
          <CardContent
            sx={{
              p: { md: 0 },
              pl: { md: 5 },
              color: 'grey.800'
            }}
          >
            <Typography gutterBottom variant="h4">
              Talk to a member of our Sales team
            </Typography>

            <Typography variant="body2" sx={{ pb: { xs: 3, xl: 5 }, maxWidth: 480, mx: 'auto' }}>
              We’ll help you find the right products and pricing for you or your business.
            </Typography>

            <Button variant="contained" target="_blank" href="https://realjournals.zendesk.com/hc/en-us">
              Contact Sales
            </Button>
          </CardContent>

          <Welcomeillustration
            sx={{
              p: 3,
              width: 360,
              margin: { xs: 'auto', md: 'inherit' }
            }}
          />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
