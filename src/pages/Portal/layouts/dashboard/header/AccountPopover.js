import { useEffect, useState } from 'react';
// @mui
import { alpha } from '@material-ui/core/styles';
import {
  Avatar,
  Typography,
  ListItemText,
  ListItemAvatar,
  MenuItem,
  Button,
  Box,
  Tooltip,
  Checkbox,
  Chip,
  Stack
} from '@material-ui/core';
// utils
import { fToNow } from 'utils/formatTime';
import { NavLink as RouterLink } from 'react-router-dom';
// components
import Iconify from 'components/Iconify';
import Scrollbar from 'components/Scrollbar';
import MenuPopover from 'components/MenuPopover';
import BadgeStatus from 'components/BadgeStatus';
import { IconButtonAnimate } from 'components/animate';
import { useAccounts, useActiveAccount } from 'hooks/account';
import { useNavigate } from 'react-router';
import router from 'router/router';
import { setActiveAccount } from 'store/slices/account';
import { useDispatch } from 'react-redux';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64;

// ----------------------------------------------------------------------

export default function AccountsPopover() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();
  const accounts = useAccounts();
  const dispatch = useDispatch();
  const activeAccount = useActiveAccount();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleAddAccount = () => {
    navigate(router.generatePath('account-setup.steps'));
  };

  const [direction, setDirection] = useState('row'); // Default direction is 'row'

  useEffect(() => {
    const handleResize = () => {
      // Change direction based on device width
      const isMobile = window.innerWidth < 600; // Adjust the breakpoint as needed
      setDirection(isMobile ? 'column' : 'row');
    };

    // Add event listener to track window resize
    window.addEventListener('resize', handleResize);

    // Initial direction setup based on device size
    handleResize();

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <Button onClick={handleOpen} variant="outlined">
        <Stack direction="row" spacing={1} justifyContent="start">
          <Typography variant="subtitle1">{activeAccount.username}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {activeAccount.server}
          </Typography>
          {direction == 'row' && (
            <Chip
              size="small"
              label={activeAccount.account_type == 'AUTO' ? 'Auto' : 'Manual'}
              sx={{ mr: 1, mb: 1 }}
              color={activeAccount.account_type == 'AUTO' ? 'primary' : 'info'}
            />
          )}
        </Stack>
      </Button>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          mt: 1.5,
          ml: 0.75,
          width: 320,
          '& .MuiMenuItem-root': {
            px: 1.5,
            height: ITEM_HEIGHT,
            borderRadius: 0.75
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Trading Accounts</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have ({accounts.data.filter((account) => Boolean(account.i_am_owner) === true).length}) accounts
            </Typography>
          </Box>
          <Tooltip title="Add New Account">
            <IconButtonAnimate color="primary" onClick={handleAddAccount}>
              <Iconify icon="eva:plus-fill" width={20} height={20} />
            </IconButtonAnimate>
          </Tooltip>
        </Box>

        <Scrollbar>
          {accounts.data
            .filter((account) => Boolean(account.i_am_owner) === true)
            .map((account) => (
              <MenuItem
                key={account.id}
                onClick={() => {
                  dispatch(setActiveAccount(account.id));
                  setOpen(null);
                }}
              >
                <Checkbox checked={account.username === activeAccount.username} />

                <ListItemText
                  primaryTypographyProps={{ typography: 'subtitle2', mb: 0.25 }}
                  secondaryTypographyProps={{ typography: 'caption' }}
                  primary={account.username}
                  secondary={account.server}
                />

                <Chip
                  size="small"
                  label={account.account_type == 'AUTO' ? 'Auto' : 'Manual'}
                  sx={{ mr: 1, mb: 1 }}
                  color={account.account_type == 'AUTO' ? 'primary' : 'info'}
                />
              </MenuItem>
            ))}
          <MenuItem
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
            component={RouterLink}
            to={router.generatePath('terminal-portal.manage-accounts')}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Manage Accounts
            </Typography>
            <IconButtonAnimate
              color="inherit"
              sx={{
                p: 1.25,
                transition: (theme) => theme.transitions.create('all'),
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)
                }
              }}
            >
              <Iconify icon="eva:options-2-fill" width={20} height={20} />
            </IconButtonAnimate>
          </MenuItem>
        </Scrollbar>
      </MenuPopover>
    </>
  );
}
