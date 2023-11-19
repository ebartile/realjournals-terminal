import React, { memo, useCallback } from 'react';
import Account from 'models/Account';
import { useActiveAccount, useAccounts } from 'hooks/account';
import { setActiveAccount } from 'redux/slices/account';
import { useDispatch } from 'react-redux';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { MenuItem, TextField, Typography } from '@material-ui/core';

const SelectAccount = memo((props) => {
  const { data } = useAccounts();
  const activeAccount = useActiveAccount();
  const dispatch = useDispatch();

  const updateAccount = useCallback(
    (e) => {
      dispatch(setActiveAccount(e.target.value));
    },
    [dispatch]
  );

  return (
    <TextField
      size="small"
      fullWidth
      value={activeAccount.id || ''}
      label="Select Account"
      onChange={updateAccount}
      select
      {...props}
    >
      {data.map((record) => {
        const account = Account.use(record);
        return (
          <MenuItem value={account.id} key={account.id}>
            <CoinStyle>
              <Typography variant="body2" ml={1} noWrap>
                {account.name}
              </Typography>
            </CoinStyle>
          </MenuItem>
        );
      })}
    </TextField>
  );
});

const CoinStyle = styled('div')({
  display: 'flex',
  alignItems: 'center',
  minWidth: 0
});

export default SelectAccount;
