import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date) {
  return format(new Date(date), 'dd MMMM yyyy');
}

export function fDateTime(date, formatString = 'dd MMM yyyy HH:mm') {
  return format(new Date(date), formatString);
}

export function fTimestamp(date) {
  return getTime(new Date(date));
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true
  });
}

const TIMEFRAMES = {
  M1: 1,
  M5: 5,
  M15: 15,
  M30: 30,
  H1: 60,
  H4: 240,
  D1: 1440,
  W1: 10080,
  MN1: 43200
};

const TIMEFRAME = {
  M1: '1m',
  M5: '5m',
  M15: '15m',
  M30: '30m',
  H1: '1h',
  H4: '4h',
  D1: '1d',
  W1: '1w',
  MN1: '1M'
};

export const findBestTimeframe = (entryTime, exitTime) => {
  const durationInMinutes = Math.abs(exitTime - entryTime) / (1000 * 60); // Calculate duration in minutes

  let bestTimeframe = 'M1';
  let minDifference = 'Infinity';

  for (const [timeframe, minutes] of Object.entries(TIMEFRAMES)) {
    const difference = Math.abs(durationInMinutes - minutes);
    if (difference < minDifference && minutes * 50 <= durationInMinutes) {
      minDifference = difference;
      bestTimeframe = timeframe;
    }
  }

  return TIMEFRAME[bestTimeframe];
};
