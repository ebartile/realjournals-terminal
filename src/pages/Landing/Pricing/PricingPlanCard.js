import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import checkmarkFill from '@iconify/icons-eva/checkmark-fill';
import { styled } from '@material-ui/core/styles';
import { Card, Button, Typography, Box, Stack } from '@material-ui/core';
import Label from 'components/Label';
import router from 'router';
import arrowForwardOutline from '@iconify/icons-eva/arrow-forward-outline';
import { setSubscription } from 'store/slices/global';
import { useDispatch } from 'react-redux';

const RootStyle = styled(Card)(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  flexDirection: 'column',
  padding: theme.spacing(3),
  [theme.breakpoints.up(414)]: {
    padding: theme.spacing(5)
  }
}));

// ----------------------------------------------------------------------

PricingPlanCard.propTypes = {
  index: PropTypes.number,
  accounts: PropTypes.number,
  card: PropTypes.object
};

export default function PricingPlanCard({ card, index, accounts, isMonthly }) {
  const { subscription, price, lists, labelAction } = card;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <RootStyle>
      {index === 1 && (
        <Label
          color="info"
          sx={{
            top: 16,
            right: 16,
            position: 'absolute'
          }}
        >
          POPULAR
        </Label>
      )}

      <Typography variant="overline" sx={{ color: 'text.secondary' }}>
        {subscription}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          $
        </Typography>
        <Typography variant="h2" sx={{ mx: 1 }}>
          {price === 0 ? 'Free' : isMonthly ? (price * 0.9).toFixed(0) : price.toFixed(0)}
        </Typography>
      </Box>

      {price !== 0 && (
        <>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary'
            }}
          >
            per trading account/{isMonthly ? 'year' : 'month'}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'primary.main',
              textTransform: 'capitalize'
            }}
          >
            ${isMonthly ? (price * accounts * 12 * 0.9).toFixed(0) : (price * accounts).toFixed(0)}/year for {accounts}{' '}
            trading account
            {accounts === 1 ? '' : 's'}
          </Typography>
        </>
      )}

      <Button
        fullWidth
        sx={{ mt: 2 }}
        size="large"
        variant="contained"
        onClick={() => {
          dispatch(setSubscription(subscription));
          navigate(router.generatePath('account-setup.steps'));
        }}
      >
        {labelAction}
      </Button>

      {price !== 0 && (
        <Button
          fullWidth
          size="large"
          onClick={() => {
            dispatch(setSubscription(subscription));
            navigate(router.generatePath('account-setup.steps'));
          }}
          sx={{ mt: 1 }}
        >
          Buy Now
          <Icon icon={arrowForwardOutline} style={{ marginLeft: '8px' }} />
        </Button>
      )}

      <Stack component="ul" spacing={2} sx={{ my: 5, width: 1 }}>
        {lists.map((item) => (
          <Stack
            key={item.text}
            component="li"
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ typography: 'body2', color: item.isAvailable ? 'text.primary' : 'text.disabled' }}
          >
            <Box component={Icon} icon={checkmarkFill} sx={{ width: 20, height: 20 }} />
            <Typography variant="body2">{item.text}</Typography>
          </Stack>
        ))}
      </Stack>
    </RootStyle>
  );
}
