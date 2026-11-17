import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = 'Asia/Kolkata';

/**
 * Formats an ISO UTC date string into Asia/Kolkata (IST)
 * Example output: "17 Nov 2026, 02:41 PM IST"
 */
export const formatToIST = (
  isoString: string | null | undefined,
  format = 'DD MMM YYYY, hh:mm A'
): string => {
  if (!isoString) return 'Never';
  const parsed = dayjs.utc(isoString);
  if (!parsed.isValid()) return 'Never';
  return parsed.tz(TIMEZONE).format(format);
};

/**
 * Friendly display for table rows in Asia/Kolkata timezone
 * Example outputs: "Today, 02:41 PM" or "16 Nov, 08:56 AM"
 */
export const formatLastSeenIST = (isoString: string | null | undefined): string => {
  if (!isoString) return 'Never';

  const dateInIST = dayjs.utc(isoString).tz(TIMEZONE);
  if (!dateInIST.isValid()) return 'Never';

  const nowInIST = dayjs().tz(TIMEZONE);

  if (dateInIST.isSame(nowInIST, 'day')) {
    return `Today, ${dateInIST.format('hh:mm A')}`;
  }
  return dateInIST.format('DD MMM, hh:mm A');
};

export default {
  formatToIST,
  formatLastSeenIST,
};
