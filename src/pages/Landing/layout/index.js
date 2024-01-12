import { Link as ScrollLink } from 'react-scroll';
import { useLocation, Outlet } from 'react-router-dom';
import { Box, Link, Stack, Container, IconButton, Typography } from '@material-ui/core';
import { Icon } from '@iconify/react';
import instagramFill from '@iconify-icons/ri/instagram-fill';
import twitterFill from '@iconify-icons/ri/twitter-fill';
import facebookFill from '@iconify-icons/ri/facebook-fill';
import discordFill from '@iconify-icons/ri/discord-fill';
import telegramFill from '@iconify-icons/ri/telegram-fill';
import MainNavbar from './MainNavbar';
import MainFooter from './MainFooter';
import router from 'router';
import Logo from 'assets/Logo';

// ----------------------------------------------------------------------

const SOCIALS = [
  { name: 'FaceBook', icon: facebookFill, color: '#1877F2', href: 'https://facebook.com/realjournals' },
  { name: 'Twitter', icon: twitterFill, color: '#1C9CEA', href: 'https://twitter.com/real_journals' },
  { name: 'Discord', icon: discordFill, color: '#7289DA', href: 'https://discord.gg/3Ku8b4cg' },
  { name: 'Telegram', icon: telegramFill, color: '#229ED9', href: 'https://t.me/realjournals' }
];

const LINKS = [
  { name: 'Terms of Use', href: 'https://articles.realjournals.com/terms-of-use' },
  { name: 'Privacy Notice', href: 'https://articles.realjournals.com/privacy-policy' }
];

export default function MainLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === router.getRoutePath('landing.home');

  return (
    <>
      <MainNavbar />
      <div>
        <Outlet />
      </div>

      {!isHome ? (
        <MainFooter />
      ) : (
        <Box
          sx={{
            py: 5,
            textAlign: 'center',
            position: 'relative',
            bgcolor: 'background.default'
          }}
        >
          <Container maxWidth="lg">
            <ScrollLink to="move_top" spy smooth>
              <Logo sx={{ mb: 1, mx: 'auto', cursor: 'pointer' }} />
            </ScrollLink>

            <Typography variant="caption" component="p">
              © All rights reserved
              <br />
              <Link href="https://realjournals.com/">realjournals.com</Link>
            </Typography>
            <Stack
              spacing={1.5}
              direction="row"
              justifyContent={{ xs: 'center', md: 'center' }}
              sx={{ mb: { xs: 5, md: 0 } }}
            >
              {LINKS.map((link) => (
                <Link href={link.href} key={link.name} color="inherit" variant="body2" sx={{ display: 'block' }}>
                  {link.name}
                </Link>
              ))}
            </Stack>
            <Stack
              spacing={1.5}
              direction="row"
              justifyContent={{ xs: 'center', md: 'center' }}
              sx={{ mb: { xs: 5, md: 0 } }}
            >
              {SOCIALS.map((social) => (
                <IconButton
                  key={social.name}
                  color="primary"
                  sx={{ p: 1 }}
                  component="a" // Use the 'a' tag
                  href={social.href}
                  target="_blank" // Open in a new tab
                  rel="noopener noreferrer" // Recommended for security reasons
                >
                  <Icon icon={social.icon} width={16} height={16} color={social.color} />
                </IconButton>
              ))}
            </Stack>
          </Container>
        </Box>
      )}
    </>
  );
}
