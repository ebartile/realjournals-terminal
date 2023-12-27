import { useState } from 'react';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { styled, useTheme } from '@material-ui/core/styles';
import { Box, Typography, Stack } from '@material-ui/core';
import { CarouselControlsPaging1 } from 'components/carousel';
import { MIconButton } from 'components/@material-extend';
import { useActiveAccount } from 'hooks/account';
import Slider from 'react-slick';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100%',
  '& .slick-list': {
    borderRadius: theme.shape.borderRadiusMd
  }
}));

const CardItemStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  backgroundSize: 'cover',
  padding: theme.spacing(3),
  backgroundRepeat: 'no-repeat',
  color: theme.palette.common.white,
  backgroundImage: 'url("/static/bg_card.png")',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start'
}));

const shadowStyle = {
  mx: 'auto',
  width: 'calc(100% - 16px)',
  borderRadius: 2,
  position: 'absolute',
  height: '100%',
  zIndex: 8,
  bottom: 8,
  left: 0,
  right: 0,
  bgcolor: 'grey.500',
  opacity: 0.32
};
// ----------------------------------------------------------------------

const CurrentBalance = () => {
  const activeAccount = useActiveAccount();

  const theme = useTheme();
  const [showCurrency, setShowCurrency] = useState(true);

  const onToggleShowCurrency = () => {
    setShowCurrency(!showCurrency);
  };

  const settings = {
    dots: true,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    ...CarouselControlsPaging1({
      color: 'primary.main',
      bottom: '16px !important',
      right: '16px !important'
    })
  };

  return (
    <RootStyle>
      <Box sx={{ position: 'relative', zIndex: 9 }}>
        <Slider {...settings}>
          <CardItemStyle>
            <Box>
              <Typography sx={{ mb: 2, typography: 'subtitle2', opacity: 0.72 }}>Current Balance</Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography sx={{ typography: 'h3' }}>
                  {showCurrency ? activeAccount.currency + ' ' + activeAccount.balance : '********'}
                </Typography>
                <MIconButton color="inherit" onClick={onToggleShowCurrency} sx={{ opacity: 0.48 }}>
                  <Icon icon={showCurrency ? eyeFill : eyeOffFill} />
                </MIconButton>
              </Stack>
            </Box>

            <Stack direction="row" spacing={2}>
              <Stack direction="column" spacing={2} justifyContent="start">
                <div>
                  <Typography sx={{ mb: 1, typography: 'caption', opacity: 0.48 }}>Account Trade Mode</Typography>
                  <Typography sx={{ typography: 'subtitle1' }}>
                    {activeAccount.trade_mode == 0 ? 'DEMO' : activeAccount.trade_mode == 1 ? 'CONTEST' : 'REAL'}
                  </Typography>
                </div>

                <div>
                  <Typography sx={{ mb: 1, typography: 'caption', opacity: 0.48 }}>Account Login</Typography>
                  <Typography sx={{ typography: 'subtitle1' }}>{activeAccount.username}</Typography>
                </div>
                <div>
                  <Typography sx={{ mb: 1, typography: 'caption', opacity: 0.48 }}>Account Server</Typography>
                  <Typography sx={{ typography: 'subtitle1' }}>{activeAccount.server}</Typography>
                </div>
              </Stack>
              <Stack direction="column" spacing={2} justifyContent="start">
                <div>
                  <Typography sx={{ mb: 1, typography: 'caption', opacity: 0.48 }}>Account Margin</Typography>
                  <Typography sx={{ typography: 'subtitle1' }}>
                    {showCurrency ? activeAccount.currency + ' ' + activeAccount.margin : '********'}
                  </Typography>
                </div>

                <div>
                  <Typography sx={{ mb: 1, typography: 'caption', opacity: 0.48 }}>Account Leverage</Typography>
                  <Typography sx={{ typography: 'subtitle1' }}>
                    {showCurrency ? activeAccount.currency + ' ' + activeAccount.leverage : '********'}
                  </Typography>
                </div>

                <div>
                  <Typography sx={{ mb: 1, typography: 'caption', opacity: 0.48 }}>Account Profit</Typography>
                  <Typography sx={{ typography: 'subtitle1' }}>
                    {showCurrency ? activeAccount.currency + ' ' + activeAccount.profit : '********'}
                  </Typography>
                </div>
              </Stack>
            </Stack>
          </CardItemStyle>
        </Slider>
      </Box>

      <Box sx={{ ...shadowStyle }} />
      <Box
        sx={{
          ...shadowStyle,
          opacity: 0.16,
          bottom: 0,
          zIndex: 7,
          width: 'calc(100% - 40px)'
        }}
      />
    </RootStyle>
  );
};

CurrentBalance.dimensions = {
  lg: { w: 6, h: 2, isResizable: true },
  md: { w: 4, h: 2, isResizable: true },
  sm: { w: 2, h: 2, isResizable: true },
  xs: { w: 1, h: 2, isResizable: true }
};

export default CurrentBalance;
