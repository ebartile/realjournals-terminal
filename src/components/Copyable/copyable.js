import React, { useCallback } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard/lib/Component';
import { notify } from 'utils';
import { defaultTo } from 'lodash';
import { IconButton, Stack, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { ContentCopy } from '@material-ui/icons';

const Copyable = ({ onCopy, ellipsis, containerProps, buttonProps, children, text, ...otherProps }) => {
  const handleCopy = useCallback(
    (...args) => {
      notify.success('Copied to clipboard.');
      onCopy?.(...args);
    },
    [onCopy]
  );

  return (
    <Stack direction="row" alignItems="center" {...containerProps} sx={{ minWidth: 0 }} spacing={1}>
      <Typography noWrap={ellipsis} {...otherProps}>
        {children}
      </Typography>

      <CopyToClipboard text={defaultTo(text, children)} onCopy={handleCopy}>
        <IconButton size="small" {...buttonProps}>
          <ContentCopy fontSize="inherit" />
        </IconButton>
      </CopyToClipboard>
    </Stack>
  );
};

Copyable.propTypes = { text: PropTypes.string };

export default Copyable;
