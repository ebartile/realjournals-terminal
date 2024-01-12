import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@material-ui/core/styles';
import { Button, Box, Link, Container, Typography, Stack } from '@material-ui/core';
// components
import Image from 'components/Image';
import Iconify from 'components/Iconify';
import TextIconLabel from 'components/TextIconLabel';
import { MotionContainer, varFade, varFadeIn } from 'components/animate';
import router from 'router/router';
import { useAuth } from 'models/Auth';

// ----------------------------------------------------------------------

const RootStyle = styled(m.div)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.grey[400],
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    display: 'flex',
    position: 'fixed',
    alignItems: 'center'
  }
}));

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(({ theme }) => ({
  zIndex: 10,
  maxWidth: 520,
  margin: 'auto',
  textAlign: 'center',
  position: 'relative',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(15),
  [theme.breakpoints.up('md')]: {
    margin: 'unset',
    textAlign: 'left'
  }
}));

const HeroOverlayStyle = styled(m.img)({
  zIndex: 9,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

const HeroImgStyle = styled(m.img)(({ theme }) => ({
  top: 0,
  right: 0,
  bottom: 0,
  zIndex: 8,
  width: '100%',
  margin: 'auto',
  position: 'absolute',
  [theme.breakpoints.up('lg')]: {
    right: '8%',
    width: 'auto',
    height: '48vh'
  }
}));

// ----------------------------------------------------------------------

export default function HomeHero() {
  const auth = useAuth();

  return (
    <MotionContainer>
      <RootStyle>
        <HeroOverlayStyle alt="overlay" src="/static/overlay.svg" />

        <HeroImgStyle alt="hero" src="static/hero.png" />

        <Container>
          <ContentStyle>
            <m.div>
              <Typography variant="h1" sx={{ color: 'common.white' }}>
                Start Journaling <br /> your
                <Typography component="span" variant="h1" sx={{ color: 'primary.main' }}>
                  &nbsp;Trades
                </Typography>
              </Typography>
            </m.div>

            <m.div>
              <Typography sx={{ color: 'common.white' }}>We currenty support.</Typography>
            </m.div>

            <Stack spacing={2.5} alignItems="center" direction={{ xs: 'column', md: 'row' }}>
              {['mt5'].map((resource) => (
                <m.img key={resource} initial={{ height: 20 }} src={`/static/logo/${resource}.svg`} />
              ))}
            </Stack>
            {!auth.user && (
              <m.div>
                <Button
                  size="large"
                  variant="contained"
                  component={RouterLink}
                  to={router.generatePath('auth.login')}
                  startIcon={<Iconify icon={'eva:flash-fill'} width={20} height={20} />}
                >
                  Login
                </Button>
                <Button
                  size="large"
                  variant="outlined"
                  sx={{ ml: 5 }}
                  component={RouterLink}
                  to={router.generatePath('auth.register')}
                  startIcon={<Iconify icon={'eva:lock-fill'} width={20} height={20} />}
                >
                  Get Started
                </Button>
              </m.div>
            )}

            {auth.user && (
              <m.div>
                <Button
                  size="large"
                  variant="contained"
                  component={RouterLink}
                  to={router.generatePath('terminal-portal.analytics')}
                  startIcon={<Iconify icon={'eva:flash-fill'} width={20} height={20} />}
                >
                  View Dashboard
                </Button>
              </m.div>
            )}

            <Stack spacing={2.5}>
              <m.div>
                <Typography variant="overline" sx={{ color: 'primary.light' }}>
                  We are working hard to also support
                </Typography>
              </m.div>

              <Stack direction="row" spacing={1.5} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                {['mt4.svg'].map((resource) => (
                  <m.img initial={{ height: 20 }} key={resource} src={`/static/logo/${resource}`} />
                ))}
              </Stack>
            </Stack>
          </ContentStyle>
        </Container>
      </RootStyle>
      <Box sx={{ height: { md: '100vh' } }} />
    </MotionContainer>
  );
}
