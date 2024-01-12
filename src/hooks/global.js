import { useSelector } from 'react-redux';
import { get } from 'lodash';

export function useSubscription() {
  const { subscription } = useSelector((state) => {
    return get(state, 'global');
  });
  return subscription;
}

export function useIsMonthly() {
  const { isMonthly } = useSelector((state) => {
    return get(state, 'global');
  });
  return isMonthly;
}

export function useTokens() {
  const { access_token, refresh_token, auth_token } = useSelector((state) => {
    return get(state, 'global');
  });
  return { access_token, refresh_token, auth_token };
}
