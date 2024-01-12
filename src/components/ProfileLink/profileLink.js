import React, { useMemo } from 'react';
import router from 'router/router';
import { Link } from 'react-router-dom';
import { Box } from '@material-ui/core';

const ProfileLink = ({ user, sx, ...otherProps }) => {
  const link = useMemo(() => {
    // TODO
    return '/';
    // return router.generatePath('terminal-portal.profile', { name: user.username });
  }, [user]);

  return (
    <Box
      component={Link}
      sx={{
        minWidth: 0,
        textDecoration: 'none',
        color: 'text.primary',
        ...sx
      }}
      to={link}
      {...otherProps}
    />
  );
};

export default ProfileLink;
