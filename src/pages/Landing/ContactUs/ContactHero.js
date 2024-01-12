import { motion } from 'framer-motion';
import { styled } from '@material-ui/core/styles';
import { Box, Container, Typography, Grid } from '@material-ui/core';
import { varFadeIn, varWrapEnter, varFadeInRight, TextAnimate } from 'components/animate';

const CONTACTS = [
  {
    country: 'Nairobi',
    address: '508 Mio Avenue, Plot 1121 Development House 30263',
    phoneNumber: '+254 757-807 150'
  },
  {
    country: 'Lagos',
    address: '458 John Luke Avenue, Plot 5231, Union House Lagos',
    phoneNumber: '+234 808-305 0132'
  }
];

const RootStyle = styled(motion.div)(({ theme }) => ({
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundImage: 'url(/static/overlay.svg), url(/static/contact/hero.jpg)',
  padding: theme.spacing(10, 0),
  [theme.breakpoints.up('md')]: {
    height: 560,
    padding: 0
  }
}));

const ContentStyle = styled('div')(({ theme }) => ({
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    textAlign: 'left',
    position: 'absolute'
  }
}));

// ----------------------------------------------------------------------

export default function ContactHero() {
  return (
    <RootStyle initial="initial" animate="animate" variants={varWrapEnter}>
      <Container maxWidth="lg" sx={{ position: 'relative', height: '100%' }}>
        <ContentStyle>
          <TextAnimate text="Where" sx={{ color: 'primary.main' }} variants={varFadeInRight} />
          <br />
          <Box sx={{ display: 'inline-flex', color: 'common.white' }}>
            <TextAnimate text="to" sx={{ mr: 2 }} />
            <TextAnimate text="find" sx={{ mr: 2 }} />
            <TextAnimate text="us?" />
          </Box>

          <Grid container spacing={5} sx={{ mt: 5, color: 'common.white' }}>
            {CONTACTS.map((contact) => (
              <Grid key={contact.country} item xs={12} sm={6} md={4} lg={4} sx={{ pr: { md: 5 } }}>
                <motion.div variants={varFadeIn}>
                  <Typography variant="h6" paragraph>
                    {contact.country}
                  </Typography>
                </motion.div>
                <motion.div variants={varFadeInRight}>
                  <Typography variant="body2">
                    {contact.address}
                    <br /> {contact.phoneNumber}
                  </Typography>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
