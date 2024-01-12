import { useDispatch, useSelector } from 'react-redux';
import { find, first, get } from 'lodash';
import Account from 'models/Account';
import { useEffect, useMemo } from 'react';
import { setActiveAccount } from 'store/slices/account';

export function useAccounts() {
  return useSelector((state) => {
    return get(state, 'account.accounts');
  });
}

export function useDates() {
  return useSelector((state) => {
    return get(state, 'account.dates');
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

export function useActiveAccountStats() {
  const {
    total_trades,
    total_winning_trades,
    total_lossing_trades,
    net_profit,
    net_loss,
    net_profit_loss_data,
    net_profit_loss_labels,
    trade_allocation_amounts,
    trade_allocation_categories
  } = useSelector((state) => {
    return get(state, 'account.activeAccountStats.data');
  });

  return {
    total_trades,
    total_winning_trades,
    total_lossing_trades,
    net_profit,
    net_loss,
    net_profit_loss_data,
    net_profit_loss_labels,
    trade_allocation_amounts,
    trade_allocation_categories
  };
}

/**
 * Auto select first account
 */
export function useAccountSelector() {
  let { data } = useAccounts();
  const dispatch = useDispatch();
  const account = useActiveAccount();

  data = data.filter((account) => Boolean(account.i_am_owner) === true);

  useEffect(() => {
    if (data.length && account.isEmpty()) {
      dispatch(setActiveAccount(first(data).id));
    }
  }, [account, data, dispatch]);
}
