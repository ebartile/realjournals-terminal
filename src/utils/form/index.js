import { forEach, get } from 'lodash';
import { dayjs } from 'utils/index';

export { getValidationMessages } from './validationMessage';

export function dateSorter(dataIndex) {
  return (a, b) => {
    const f = get(a, dataIndex);
    const s = get(b, dataIndex);
    return dayjs(f).diff(dayjs(s));
  };
}

export function parseDate(value, format) {
  return dayjs.utc(value, format).local();
}

export function normalizeDates(values, params = []) {
  forEach(params, (key) => {
    if (values[key]?.isValid?.()) {
      values[key] = values[key].utc().format();
    }
  });
}

export function normalizeDate(values, key) {
  if (values[key]?.isValid?.()) {
    values[key] = values[key].utc().format();
  }
}

export function passwordConfirmation(field = 'password') {
  return (form) => ({
    validator(rule, value) {
      if (value && form.getFieldValue(field) !== value) {
        const message = 'password does not match.';
        return Promise.reject(new Error(message));
      }
      return Promise.resolve();
    }
  });
}
