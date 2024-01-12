import React from 'react';
import { Stack, Typography } from '@material-ui/core';

const CurrencyCell = ({ currency, country, balance }) => {
  return (
    currency && (
      <Stack sx={{ minWidth: 0 }}>
        <Typography variant="body2" noWrap>
          {`${currency}`}
        </Typography>

        <Typography variant="caption" noWrap>
          {`${balance}`}
        </Typography>

        {country && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
            {`(${country})`}
          </Typography>
        )}
      </Stack>
    )
  );
};

export default CurrencyCell;
