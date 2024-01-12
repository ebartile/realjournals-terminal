import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { alpha, styled } from '@material-ui/core/styles';
import { Box, Divider, Icon, Link, MenuItem, Stack, Typography } from '@material-ui/core';
// components
import MyAvatar from 'components/MyAvatar';
import router from 'router';
import { useAccounts, useActiveAccount } from 'hooks/account';
import AccountPopover from '../header/AccountPopover';
import { useState } from 'react';
import MenuPopover from 'components/MenuPopover';
import { IconButtonAnimate } from 'components/animate';
import { addIcon } from '@iconify/react';
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
    <Link underline="none" color="inherit">
      <RootStyle
        sx={{
          ...(isCollapse && {
            bgcolor: 'transparent'
          })
        }}
      >
        <MyAvatar />

        {!isCollapse && (
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
              @{auth.user?.username}
            </Typography>
          </Box>
        )}
      </RootStyle>
    </Link>
  );
}
