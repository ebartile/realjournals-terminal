import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@material-ui/core/styles';
import { Box, Link, Typography } from '@material-ui/core';
// components
import MyAvatar from 'components/MyAvatar';
import router from 'router';
import { useAuth } from 'models/Auth';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter
  })
}));

// ----------------------------------------------------------------------

NavbarAccount.propTypes = {
  isCollapse: PropTypes.bool
};

export default function NavbarAccount({ isCollapse }) {
  const auth = useAuth();

  return (
    <Link underline="none" color="inherit" component={RouterLink} to={'/'}>
      <RootStyle
        sx={{
          ...(isCollapse && {
            bgcolor: 'transparent'
          })
        }}
      >
        <MyAvatar />

        <Box
          sx={{
            ml: 2,
            transition: (theme) =>
              theme.transitions.create('width', {
                duration: theme.transitions.duration.shorter
              }),
            ...(isCollapse && {
              ml: 0,
              width: 0
            })
          }}
        >
          <Typography variant="subtitle2" noWrap>
            {auth.user?.full_name_display}
          </Typography>
          <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
            {auth.user?.role}
          </Typography>
        </Box>
      </RootStyle>
    </Link>
  );
}
