import { styled } from '@material-ui/core/styles';
import { Box, Grid, Switch, Container, Typography, Stack } from '@material-ui/core';
import Page from 'components/Page';
import PricingPlanCard from './PricingPlanCard';
import { useState } from 'react';
import { MIconButton } from 'components/@material-extend';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
import TalkToUs from './TalkToUs';

const PLANS = [
  // {
  //   subscription: 'team',
  //   price: 55,
  //   lists: [
  //     { text: '3 prototypes', isAvailable: true },
  //     { text: '3 boards', isAvailable: true },
  //     { text: 'Up to 5 team members', isAvailable: true },
  //     { text: 'Advanced security', isAvailable: false },
  //     { text: 'Permissions & workflows', isAvailable: false }
  //   ],
  //   labelAction: 'free trial'
  // },
  // {
  //   subscription: 'growth',
  //   price: 89,
  //   lists: [
  //     { text: '3 prototypes', isAvailable: true },
  //     { text: '3 boards', isAvailable: true },
  //     { text: 'Up to 5 team members', isAvailable: true },
  //     { text: 'Advanced security', isAvailable: true },
  //     { text: 'Permissions & workflows', isAvailable: true }
  //   ],
  //   labelAction: 'free trial'
  // },
  {
    subscription: 'free',
    price: 0,
    lists: [
      { text: 'Analytics', isAvailable: true },
      { text: 'Manual Journaling', isAvailable: true },
      { text: 'Calendar', isAvailable: true },
      { text: 'Up to 5 followers', isAvailable: true },
      { text: 'Advanced security', isAvailable: true },
      { text: 'Permissions & workflows', isAvailable: true }
    ],
    labelAction: 'free trial'
  },
  {
    subscription: 'professional',
    price: 10,
    lists: [
      { text: 'Analytics', isAvailable: true },
      { text: 'Automatated Journaling', isAvailable: true },
      { text: 'Calendar', isAvailable: true },
      { text: 'Unlimited Followers', isAvailable: true },
      { text: 'Advanced security', isAvailable: true },
      { text: 'Permissions & workflows', isAvailable: true }
    ],
    labelAction: 'free trial'
  }
];

const RootStyle = styled(Page)(({ theme }) => ({
  minHeight: '100%',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

const IncrementerStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.5, 0.75),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.grey[500_32]}`
}));

const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: 'cover',
  marginRight: theme.spacing(2),
  borderRadius: theme.shape.borderRadiusSm
}));

// ----------------------------------------------------------------------

export default function Pricing() {
  const [accounts, setAccounts] = useState(1);
  const [isChecked, setIsChecked] = useState(false);

  const handleIncreaseQuantity = (event) => {
    setAccounts(accounts + 1);
  };

  const handleDecreaseQuantity = (event) => {
    setAccounts(accounts - 1);
  };

  const handleSwitchChange = (event) => {
    setIsChecked(event.target.checked);
  };

  return (
    <RootStyle title="Pricing | Real Journals">
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" paragraph>
          Flexible plans for your
          <br /> trading accounts and needs
        </Typography>
        <Typography align="center" sx={{ color: 'text.secondary' }}>
          Your complete solution for journaling, trading, communicating
        </Typography>

        <Box sx={{ my: 5 }}>
          <Stack direction="row" alignItems="center" justifyContent="center">
            <Typography variant="overline" sx={{ mr: 1.5 }}>
              MONTHLY
            </Typography>
            <Switch checked={isChecked} onChange={handleSwitchChange} name="mySwitch" color="primary" />
            <Typography variant="overline" sx={{ ml: 1.5 }}>
              YEARLY (save 10%)
            </Typography>
          </Stack>
          <Typography variant="caption" align="center" sx={{ color: 'text.secondary', display: 'block' }}>
            * Plus applicable taxes
          </Typography>
          <Stack direction="column" alignItems="center" justifyContent="flex-end">
            <Typography variant="overline" sx={{ mb: 1.5 }}>
              NUMBER OF TRADING ACCOUNTS
            </Typography>
            <IncrementerStyle>
              <MIconButton size="small" color="inherit" onClick={handleDecreaseQuantity} disabled={accounts <= 1}>
                <Icon icon={minusFill} width={16} height={16} />
              </MIconButton>
              {accounts}
              <MIconButton size="small" color="inherit" onClick={handleIncreaseQuantity}>
                <Icon icon={plusFill} width={16} height={16} />
              </MIconButton>
            </IncrementerStyle>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={2}></Grid>
          {PLANS.map((card, index) => (
            <Grid item xs={12} md={4} key={card.subscription}>
              <PricingPlanCard card={card} index={index} accounts={accounts} isMonthly={isChecked} />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ my: 5 }}>
          <TalkToUs />
        </Box>
      </Container>
    </RootStyle>
  );
}
