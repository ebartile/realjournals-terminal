import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
import { Typography, Button, Card, CardContent, Box, Stack } from '@material-ui/core';
import checkmarkFill from '@iconify/icons-eva/checkmark-fill';
import { Icon } from '@iconify/react';

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

TalkToUs.propTypes = {
  displayName: PropTypes.string
};

export default function TalkToUs() {
  return (
    <RootStyle>
      <ContentStyle>
        <CardContent
          sx={{
            p: { md: 0 },
            pl: { md: 5 },
            color: 'grey.800'
          }}
        >
          <Typography gutterBottom variant="h4">
            Suite Enterprise Plus
          </Typography>

          <Typography variant="body2" sx={{ pb: { xs: 3, xl: 5 }, maxWidth: 480, mx: 'auto' }}>
            Talk to us for a comprehensive solution that meets all your enterprise needs.
          </Typography>

          <Button sx={{ mb: 2 }} variant="contained" target="_blank" href="https://realjournals.zendesk.com/hc/en-us">
            Talk To Sales
          </Button>

          <Typography variant="body2" sx={{ pb: { xs: 3, xl: 5 }, maxWidth: 480, mx: 'auto' }}>
            Includes the advanced security you need
          </Typography>
          <Box
            component="img"
            src="/static/pricing/security-2x.png"
            sx={{ display: 'inline-block', height: 20, objectFit: 'cover' }}
          />
        </CardContent>
        <CardContent
          sx={{
            p: { md: 0 },
            pl: { md: 5 },
            color: 'grey.800',
            borderLeft: '2px solid #9ca3aa',
            mt: 4
          }}
        >
          <Typography gutterBottom variant="h5">
            Talk to us for a comprehensive solution that meets all your enterprise needs
          </Typography>

          <Stack component="ul" spacing={2} sx={{ my: 5, width: 1 }}>
            <Stack component="li" direction="row" alignItems="center" spacing={1.5} sx={{ typography: 'body2' }}>
              <Box component={Icon} icon={checkmarkFill} sx={{ width: 20, height: 20 }} />
              <Typography variant="body2">
                Optimize support and fine-tune change management with our most robust sandbox
              </Typography>
            </Stack>
            <Stack component="li" direction="row" alignItems="center" spacing={1.5} sx={{ typography: 'body2' }}>
              <Box component={Icon} icon={checkmarkFill} sx={{ width: 20, height: 20 }} />
              <Typography variant="body2">Scale your trades with our highest API rate limits</Typography>
            </Stack>
            <Stack component="li" direction="row" alignItems="center" spacing={1.5} sx={{ typography: 'body2' }}>
              <Box component={Icon} icon={checkmarkFill} sx={{ width: 20, height: 20 }} />
              <Typography variant="body2">Protect your operations with enhanced disaster recovery</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </ContentStyle>
    </RootStyle>
  );
}
