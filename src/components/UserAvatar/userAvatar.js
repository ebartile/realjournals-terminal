import React, { useEffect, useMemo, useState } from 'react';
import { isString, toLower } from 'lodash';
import { styled } from '@material-ui/core/styles';
import { Person } from '@material-ui/icons';
import { Avatar, Badge } from '@material-ui/core';
import PropTypes from 'prop-types';

const UserAvatar = (props) => {
  const { user, showPresence = true, ...otherProps } = props;
  const [presence, setPresence] = useState(user?.presence);

  useEffect(() => {
    setPresence(user?.presence);
  }, [user]);

  const color = useMemo(() => {
    switch (presence) {
      case 'away':
        return 'warning';
      case 'online':
        return 'success';
      default:
        return 'error';
    }
  }, [presence]);

  if (!user?.id) {
    return (
      <Avatar alt="avatar" {...otherProps}>
        <Person fontSize="inherit" />
      </Avatar>
    );
  }

  if (!isString(user.photo)) {
    if (user.first_name && isString(user.first_name)) {
      otherProps.children = user.first_name.charAt(0).toLowerCase();
    } else {
      otherProps.children = ''; // Or handle the absence of first name as per your requirement
    }
  } else {
    otherProps.src = user.photo;
  }

  if (!showPresence) {
    return <Avatar {...otherProps} />;
  }

  return (
    <StyledBadge
      overlap="circular"
      color={color}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      invisible={presence === 'offline'}
      variant="dot"
    >
      <Avatar {...otherProps} />
    </StyledBadge>
  );
};

const StyledBadge = styled(Badge)(({ theme, color }) => ({
  '& .MuiBadge-badge': {
    color: theme.palette[color].main,
    boxShadow: theme.customShadows.z8,
    width: '20%',
    height: '20%',
    '&::after': {
      left: 0,
      top: 0,
      position: 'absolute',
      border: '1px solid currentColor',
      content: '""',
      borderRadius: '50%',
      width: '100%',
      height: '100%',
      ...(color === 'success' && {
        animation: 'ripple 1.2s infinite ease-in-out'
      })
    }
  },
  '@keyframes ripple': {
    '0%': { transform: 'scale(.8)', opacity: 1 },
    '100%': { transform: 'scale(2)', opacity: 0 }
  }
}));

UserAvatar.propTypes = {
  user: PropTypes.object,
  showPresence: PropTypes.bool
};

export default UserAvatar;
