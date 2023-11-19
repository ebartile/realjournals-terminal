import { useDispatch, useSelector } from 'react-redux';
import { find, first, get } from 'lodash';
import Account from 'models/Account';
import { useEffect, useMemo } from 'react';
import { setActiveAccount } from 'redux/slices/account';

export function useAccounts() {
  return useSelector((state) => {
    return get(state, 'account.accounts');
  });
}

/**
 * Get active selected account
 *
 * @returns {Account}
 */
export function useActiveAccount() {
  const { data } = useAccounts();

  const id = useSelector((state) => {
    return get(state, 'account.activeAccount');
  });

  return useMemo(() => {
    const record = find(data, (o) => {
      return o.id === id;
    });
    return Account.use(record);
  }, [id, data]);
}

/**
 * Auto select first account
 */
export function useAccountSelector() {
  const { data } = useAccounts();
  const dispatch = useDispatch();
  const account = useActiveAccount();

  useEffect(() => {
    if (data.length && account.isEmpty()) {
      dispatch(setActiveAccount(first(data).id));
    }
  }, [account, data, dispatch]);
}
