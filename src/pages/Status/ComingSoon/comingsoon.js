import { Icon } from '@iconify/react';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import facebookFill from '@iconify/icons-eva/facebook-fill';
import instagramFilled from '@iconify/icons-ant-design/instagram-filled';
import discordFill from '@iconify-icons/ri/discord-fill';
import telegramFill from '@iconify-icons/ri/telegram-fill';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Button, Tooltip, Container, Typography, InputAdornment, OutlinedInput } from '@material-ui/core';
// hooks
import useCountdown from 'hooks/useCountdown';
// components
import { MIconButton } from 'components/@material-extend';
import Page from 'components/Page';
// import ComingSoonIllustration from './ComingSoonIllustration';

// ----------------------------------------------------------------------

const SOCIALS = [
  {
    name: 'Facebook',
    icon: <Icon icon={facebookFill} width={24} height={24} color="#1877F2" />,
    href: 'https://facebook.com/realjournals'
  },
  {
    name: 'Twitter',
    icon: <Icon icon={twitterFill} width={24} height={24} color="#1C9CEA" />,
    href: 'https://twitter.com/real_journals'
  },
  {
    name: 'Discord',
    icon: <Icon icon={discordFill} width={24} height={24} color="#7289DA" />,
    href: 'https://discord.gg/3Ku8b4cg'
  },
  {
    name: 'Telegram',
    icon: <Icon icon={telegramFill} width={24} height={24} color="#229ED9" />,
    href: 'https://t.me/realjournals'
  }
];

const RootStyle = styled(Page)(({ theme }) => ({
  minHeight: '100%',
  display: 'flex',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

const CountdownStyle = styled('div')({
  display: 'flex',
  justifyContent: 'center'
});

const SeparatorStyle = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  [theme.breakpoints.up('sm')]: {
    margin: theme.spacing(0, 2.5)
  }
}));

// ----------------------------------------------------------------------

export default function ComingSoon() {
  const countdown = useCountdown(new Date('01/01/2024 00:00'));

  return (
    <RootStyle title="Coming Soon | Real Journals">
      <Container>
        <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
          <Typography variant="h3" paragraph>
            Coming Soon!
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>We are currently working hard on this page!</Typography>

          {/* <ComingSoonIllustration sx={{ my: 10, height: 240 }} /> */}

          <CountdownStyle>
            <div>
              <Typography variant="h2">{countdown.days}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Days</Typography>
            </div>

            <SeparatorStyle variant="h2">:</SeparatorStyle>

            <div>
              <Typography variant="h2">{countdown.hours}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Hours</Typography>
            </div>

            <SeparatorStyle variant="h2">:</SeparatorStyle>

            <div>
              <Typography variant="h2">{countdown.minutes}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Minutes</Typography>
            </div>

            <SeparatorStyle variant="h2">:</SeparatorStyle>

            <div>
              <Typography variant="h2">{countdown.seconds}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Seconds</Typography>
            </div>
          </CountdownStyle>

          <OutlinedInput
            fullWidth
            placeholder="Enter your email"
            endAdornment={
              <InputAdornment position="end">
                <Button variant="contained" size="large">
                  Notify Me
                </Button>
              </InputAdornment>
            }
            sx={{
              my: 5,
              pr: 0.5,
              transition: (theme) =>
                theme.transitions.create('box-shadow', {
                  easing: theme.transitions.easing.easeInOut,
                  duration: theme.transitions.duration.shorter
                }),
              '&.Mui-focused': {
                boxShadow: (theme) => theme.customShadows.z8
              },
              '& fieldset': {
                borderWidth: `1px !important`,
                borderColor: (theme) => `${theme.palette.grey[500_32]} !important`
              }
            }}
          />

          <Box sx={{ textAlign: 'center', '& > *': { mx: 1 } }}>
            {SOCIALS.map((social) => (
              <Tooltip key={social.name} title={social.name} href={social.href}>
                <MIconButton>{social.icon}</MIconButton>
              </Tooltip>
            ))}
          </Box>
        </Box>
      </Container>
    </RootStyle>
  );
}
