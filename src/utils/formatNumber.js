import { replace } from 'lodash';
import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fCurrency(number) {
  return numeral(number).format(Number.isInteger(number) ? '$0,0' : '$0,0.00');
}

export function fPercent(number) {
  return numeral(number / 100).format('0.0%');
}

export function fNumber(number) {
  return numeral(number).format();
}

export function fShortenNumber(number, decimals) {
  let formatString = '0.000'; // Default format string with 3 decimal places

  if (decimals === 1) {
    formatString = '0.0a'; // Format for 1 decimal place
  } else if (decimals === 2) {
    formatString = '0.00a'; // Format for 2 decimal places
  } else if (decimals === 3) {
    formatString = '0.000a'; // Format for 3 decimal places
  } else {
    formatString = '0.a'; // Format for 0 decimal place
  }

  const formattedNumber = numeral(number).format(formatString);
  // Assuming replace is available and does the intended functionality
  return replace(formattedNumber, '.0', ''); // Remove trailing '.0'
}

export function fData(number) {
  return numeral(number).format('0.0 b');
}
