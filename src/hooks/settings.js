import { useSelector } from 'react-redux';
import { get } from 'lodash';

export function useBrand() {
  return useSelector((state) => {
    return get(state, 'settings.brand');
  });
}

export function useRecaptcha() {
  return useSelector((state) => {
    return get(state, 'settings.recaptcha');
  });
}

export function useCrsfToken() {
  return useSelector((state) => {
    return get(state, 'settings.crsf_token');
  });
}
