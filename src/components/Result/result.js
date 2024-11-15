import React from 'react';
import { experimentalStyled as styled, useTheme } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import EmptyContent from 'assets/empty_content';

const Result = ({
  title,
  description,
  icon: Illustration = EmptyContent,
  iconProps = {},
  iconSize = 240,
  extra,
  ...other
}) => {
  const theme = useTheme();
  const { sx: iconSx, ...otherIconProps } = iconProps;
  return (
    <BaseStyle {...other}>
      <Illustration
        sx={{
          width: iconSize,
          height: 'auto',
          margin: theme.spacing(3),
          ...iconSx
        }}
        {...otherIconProps}
      />

      {title && (
        <Typography variant={description ? 'h6' : 'body2'} gutterBottom>
          {title}
        </Typography>
      )}

      {description && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }} gutterBottom>
          {description}
        </Typography>
      )}

      {extra && <Box sx={{ mt: 1 }}>{extra}</Box>}
    </BaseStyle>
  );
};

const BaseStyle = styled('div')(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(8, 4),
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  justifyContent: 'center',
  alignItems: 'center'
}));

export default Result;
