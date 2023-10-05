import { DateTime } from 'luxon';

export function convertDateToDayOfWeek(date) {
  const dayOfWeek = DateTime.fromISO(date).toFormat('EEEE');
  return dayOfWeek;
}

export function formatTimeHourOnly(timeString) {
  const [hourString] = timeString.split(':');
  const hour = +hourString % 24;
  return `${hour % 12 || 12}${hour < 12 ? 'AM' : 'PM'}`;
}

export function horse() {
  return 'horse';
}
