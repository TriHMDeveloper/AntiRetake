const MILIS_PER_DAY = 1000 * 60 * 60 * 24;
const MILIS_PER_MINUTES = 1000 * 60;
const MILIS_PER_HOURS = 1000 * 60 * 60;

export const calDaysBetween = (date: Date) => {
  const today = new Date();

  return Math.ceil((today.getTime() - date.getTime()) / MILIS_PER_DAY);
};

export const calMinsBetween = (date: Date) => {
  const today = new Date();

  return Math.ceil((today.getTime() - date.getTime()) / MILIS_PER_MINUTES);
};

export const calHoursBetween = (date: Date) => {
  const today = new Date();

  return Math.ceil((today.getTime() - date.getTime()) / MILIS_PER_HOURS) - 1;
};

export const parseTimestampToDateString = (timestamp: Date) => {
  let result = '';
  const locale = 'vi';

  const dateString = timestamp.toLocaleDateString(locale);

  const today = new Date();
  const todayString = today.toLocaleDateString(locale);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toLocaleDateString(locale);

  const daysBetween = calDaysBetween(timestamp);

  if (dateString === todayString) {
    result = 'Today';
  } else if (dateString === yesterdayString) {
    result = 'Yesterday';
  } else if (daysBetween <= 7) {
    result = `${daysBetween} days ago`;
  } else if (daysBetween > 7 && daysBetween <= 14) {
    result = 'Last week';
  } else if (daysBetween > 14) {
    result = dateString;
  }
  return result;
};

export const parseTimestampToNotiDateString = (timestamp: Date) => {
  let result = '';
  const locale = 'vi';

  const dateString = timestamp.toLocaleDateString(locale);

  const today = new Date();
  const todayString = today.toLocaleDateString(locale);

  const minsBetween = calMinsBetween(timestamp);
  const hoursBetween = calHoursBetween(timestamp);
  const daysBetween = calDaysBetween(timestamp);

  if (minsBetween <= 1) {
    result = '1 minute ago';
  } else if (minsBetween < 60) {
    result = `${minsBetween} minutes ago`;
  } else if (minsBetween <= 120) {
    result = '1 hour ago';
  } else if (daysBetween <= 1) {
    result = `${hoursBetween} hours ago`;
  } else {
    result = dateString;
  }
  return result;
};
