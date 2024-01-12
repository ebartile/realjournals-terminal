import { Icon } from '@iconify/react';
import instagramFill from '@iconify-icons/ri/instagram-fill';
import twitterFill from '@iconify-icons/ri/twitter-fill';
import facebookFill from '@iconify-icons/ri/facebook-fill';
import discordFill from '@iconify-icons/ri/discord-fill';
import telegramFill from '@iconify-icons/ri/telegram-fill';
import { Link as ScrollLink } from 'react-scroll';
import { styled } from '@material-ui/core/styles';
import { Grid, Link, Divider, Container, Typography, IconButton, Stack } from '@material-ui/core';
import Logo from 'assets/Logo';
import router from 'router/router';
import { Link as RouterLink } from 'react-router-dom';

const SOCIALS = [
  { name: 'FaceBook', icon: facebookFill, color: '#1877F2', href: 'https://facebook.com/realjournals' },
  { name: 'Twitter', icon: twitterFill, color: '#1C9CEA', href: 'https://twitter.com/real_journals' },
  { name: 'Discord', icon: discordFill, color: '#7289DA', href: 'https://discord.gg/3Ku8b4cg' },
  { name: 'Telegram', icon: telegramFill, color: '#229ED9', href: 'https://t.me/realjournals' }
];

const LINKS = [
  {
    headline: 'TOP FEATURES',
    children: [
      { name: 'Community', href: 'https://articles.realjournals.com/features/community', internal: false },
      { name: 'Analytics', href: 'https://articles.realjournals.com/features/analytics', internal: false },
      { name: 'Cloning', href: 'https://articles.realjournals.com/features/cloning', internal: false },
      { name: 'Knowledge base', href: 'https://articles.realjournals.com/features/knowledge-base', internal: false },
      {
        name: 'Advanced Data Privacy and Protection',
        href: 'https://articles.realjournals.com/features/data-protection',
        internal: true
      }
    ]
  },
  {
    headline: 'RESOURCES',
    children: [
      { name: 'Security', href: 'https://articles.realjournals.com/security', internal: false },
      { name: 'Product support', href: 'https://realjournals.zendesk.com/hc/en-us/', internal: false },
      { name: 'Request a demo', href: '#', internal: false },
      { name: 'Blog', href: 'https://articles.realjournals.com/blog', internal: false },
      { name: 'Training', href: 'https://articles.realjournals.com/training', internal: false }
    ]
  },
  {
    headline: 'COMPANY',
    children: [
      { name: 'About us', href: 'https://articles.realjournals.com/about-us', internal: false },
      { name: 'Investors', href: 'https://articles.realjournals.com/investors', internal: false },
      { name: 'Events & Webinars', href: 'https://articles.realjournals.com/events', internal: false },
      { name: 'Careers', href: 'https://articles.realjournals.com/careers', internal: false },
      { name: 'Contact us', href: router.getRoutePath('landing.contact-us'), internal: true },
      { name: 'Partners', href: 'https://articles.realjournals.com/partners', internal: false }
    ]
  }
];

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.default
}));

// ----------------------------------------------------------------------

export default function MainFooter() {
  return (
    <RootStyle>
      <Divider />
      <Container maxWidth="lg" sx={{ pt: 10 }}>
        <Grid
          container
          justifyContent={{ xs: 'center', md: 'space-evenly' }}
          sx={{ textAlign: { xs: 'center', md: 'left' } }}
        >
          <Grid item xs={12} md={9}>
            <Stack spacing={5} direction={{ xs: 'column', md: 'row' }} justifyContent="space-evenly">
              {LINKS.map((list) => {
                const { headline, children } = list;
                return (
                  <Stack key={headline} spacing={2}>
                    <Typography component="p" variant="overline">
                      {headline}
                    </Typography>
                    {children.map((link) =>
                      link.internal ? (
                        // Internal Link
                        <Link
                          to={link.href}
                          key={link.name}
                          color="inherit"
                          variant="body2"
                          component={RouterLink}
                          sx={{ display: 'block' }}
                        >
                          {link.name}
                        </Link>
                      ) : (
                        // External Link
                        <Link
                          href={link.href}
                          key={link.name}
                          color="inherit"
                          variant="body2"
                          target="_blank" // Open link in a new tab
                          rel="noopener noreferrer" // Security attribute for external links
                          sx={{ display: 'block' }}
                        >
                          {link.name}
                        </Link>
                      )
                    )}
                  </Stack>
                );
              })}
            </Stack>
          </Grid>

          <Grid item xs={8} md={3}>
            <ScrollLink to="move_top" spy smooth>
              <Logo sx={{ mx: { xs: 'auto', md: 'inherit' } }} />
            </ScrollLink>

            <Typography variant="h4" sx={{ pr: { md: 5 } }}>
              We are Champions of Journaling.
            </Typography>

            <Stack
              spacing={1.5}
              direction="row"
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              sx={{ mt: 5, mb: { xs: 5, md: 0 } }}
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
          </Grid>
        </Grid>

        <Typography
          component="p"
          variant="body2"
          sx={{
            mt: 10,
            pb: 5,
            fontSize: 13,
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          © 2023 Real Journals. All rights reserved
        </Typography>
      </Container>
    </RootStyle>
  );
}
