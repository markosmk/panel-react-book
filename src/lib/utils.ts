import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  addDays,
  formatDistanceToNow,
  isAfter,
  isToday,
  parseISO
} from 'date-fns';
import { format as formatZonedTime, toZonedTime } from 'date-fns-tz';
import { es } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatId(id: number | string, prefix: string = '#B00k') {
  const idString = id.toString();
  return `${prefix}${idString.length < 5 ? idString.padStart(5, '0') : idString}`;
}

/** add 12 hours to object Date To normalize the date when the date object adds the local time zone, by adding 12 hours, it will never go from the current day,
 * object Date take timeZone local, then for ex for +3 output ex: 2025-01-24T15:00:00.000Z */
export function normalizeDate(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(12, 0, 0, 0);
  return normalized;
}

/** Inverse date format ex: 2024-12-31 => 31-12-2024 */
export function formatDateString(dateString: string) {
  const dateParts = dateString.split('-');
  return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
}

/**
 * Format a date in a specific format, and in a specific timezone.
 * If the date is a string, it can be in the format 'yyyy-mm-dd' or
 * 'yyyy-mm-ddTHH:MM:SSZ'. If it's a Date object, it will be converted
 * to the specified timezone.
 */
export function formatDateOnly(
  date: string | Date,
  formatStr: string = "EEEE dd 'de' MMMM, yyyy HH:mm",
  timeZone: string = 'America/Argentina/Mendoza'
): string {
  if (!date || formatStr === '') return '--';
  let dateToFormat: Date;
  if (typeof date === 'string') {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const dateTimeRegex = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}$/;

    if (dateRegex.test(date)) {
      // Trata "yyyy-MM-dd" como una fecha local
      const [year, month, day] = date.split('-').map(Number);
      dateToFormat = new Date(year, month - 1, day); // Sin UTC
    } else if (dateTimeRegex.test(date)) {
      // Trata "yyyy-MM-dd HH:mm:ss" o "yyyy-MM-ddTHH:mm:ss" como local
      const [datePart, timePart] = date.split(/[ T]/);
      const [year, month, day] = datePart.split('-').map(Number);
      const [hours, minutes, seconds] = timePart.split(':').map(Number);
      dateToFormat = new Date(year, month - 1, day, hours, minutes, seconds);
    } else {
      // Asume que otros formatos tienen zona horaria UTC
      dateToFormat = new Date(`${date}Z`);
    }
  } else {
    dateToFormat = date;
  }
  const zonedDate = toZonedTime(dateToFormat, timeZone);
  return formatZonedTime(zonedDate, formatStr, { locale: es });
}

/** transform date to human readable */
export function formatDateFriendly(
  dateString: string,
  timeZone = 'America/Argentina/Mendoza'
) {
  // timestamp from mysql always in UTC, so add Z to make it local
  const utcDate = new Date(`${dateString}Z`);
  const zonedDate = toZonedTime(utcDate, timeZone);
  return formatDistanceToNow(zonedDate, { addSuffix: true, locale: es });
}

/** transform time to human readable, ex: "15:30:00" => "15:30hs" */
export function formatTimeTo24Hour(time: string): string {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  if (!timeRegex.test(time)) {
    return '--:--';
  }
  const [hours, minutes] = time.split(':').map(Number);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}hs`;
}

/**
 * Checks if a given date string is either today or within a specified number of days ago,
 * adjusted to a given time zone.
 * Returns a boolean indicating whether the date is today or within the specified number of days ago.
 */
export function isTodayOrRecent(
  dateString: string,
  numDaysAgo: number = 1,
  timeZone: string = 'America/Argentina/Mendoza'
): boolean {
  const utcDate = parseISO(dateString);
  const dateInTimeZone = toZonedTime(utcDate, timeZone);

  const today = new Date();
  const todayInTimeZone = toZonedTime(today, timeZone);
  const recentDateInTimeZone = addDays(todayInTimeZone, -numDaysAgo);

  return (
    isToday(dateInTimeZone) || isAfter(dateInTimeZone, recentDateInTimeZone)
  );
}

/**
 * Converts a time string in the format "HH:mm:ss" to minutes.
 * For example, "02:30:00" becomes 150 minutes.
 */
// export function convertToMinutes(timeString: string): number {
//   if (!timeString) return 0;
//   const [hours, minutes] = timeString.split(':').map(Number);
//   return hours * 60 + minutes;
// }

/**
 * Calculates the duration in minutes between two given times.
 * The times are given as strings in the format "HH:mm:ss".
 * If the times cross midnight, the duration is still calculated correctly.
 */
// export function calculateDurationInMinutes(
//   startTime: string,
//   endTime: string
// ): number {
//   if (!startTime || !endTime) return 0;
//   const timeToSeconds = (time: string): number => {
//     const [hours, minutes, seconds] = time.split(':').map(Number);
//     return hours * 3600 + minutes * 60 + seconds;
//   };
//   const startSeconds = timeToSeconds(startTime);
//   const endSeconds = timeToSeconds(endTime);

//   const durationInSeconds =
//     endSeconds >= startSeconds
//       ? endSeconds - startSeconds
//       : 24 * 3600 - startSeconds + endSeconds;

//   // convert to minutes
//   return Math.floor(durationInSeconds / 60);
// }

/**
 * Formats a given Date object to a string in "HH:mm:ss" format.
 * If the date is undefined, returns "00:00:00".
 */
// export function formatTime(date: Date | undefined): string {
//   if (!date) return '00:00:00';
//   const hours = String(date.getUTCHours()).padStart(2, '0');
//   const minutes = String(date.getUTCMinutes()).padStart(2, '0');
//   const seconds = String(date.getUTCSeconds()).padStart(2, '0');
//   return `${hours}:${minutes}:${seconds}`;
// }

/**
 * Converts a given time string in the format "HH:mm:ss" to a Date object.
 * If the input string is undefined, returns a Date object set to 1970-01-01 00:00:00 UTC.
 */
// export function timeToDate(timeString: string): Date {
//   if (!timeString) return new Date(Date.UTC(1970, 0, 1));
//   const [hours, minutes, seconds] = timeString.split(':').map(Number);
//   const date = new Date(Date.UTC(1970, 0, 1));
//   date.setUTCHours(hours, minutes, seconds);
//   return date;
// }

/**
 * Formats a given number as a string in the specified currency and locale.
 */
export function formatPrice(
  price: number | string,
  currency = 'ARS',
  locale = 'es-AR'
): string {
  if (typeof price === 'string') price = parseFloat(price);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(price);
}
