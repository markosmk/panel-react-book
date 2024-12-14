import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  addDays,
  format,
  formatDistanceToNow,
  isAfter,
  isToday,
  parseISO
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ScheduleWithAvailable } from '@/types/tour.types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatDateOnly(
  date: string | Date,
  formatStr = "EEEE dd 'de' MMMM, yyyy HH:mm"
) {
  // if date is a string, add Z to make it as UTC
  const dateToFormat = typeof date === 'string' ? new Date(`${date}Z`) : date;
  return format(dateToFormat, formatStr, { locale: es });
}

export function formatDateFriendly(dateString: string) {
  // const date = parseISO(dateString);
  // timestamp from mysql always in UTC, so add Z to make it local
  const utcDate = new Date(`${dateString}Z`);
  return formatDistanceToNow(utcDate, { addSuffix: true, locale: es });
}

/** used to format time to send backend */
export function formatTime(date: Date | undefined): string {
  if (!date) return '00:00:00';
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export const formatDuration = (
  minutes: number | string | null,
  withDetails = false
) => {
  if (!minutes) return 'N/A';
  if (typeof minutes === 'string') minutes = parseInt(minutes, 10);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const hoursInWords = `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  const minutesInWords = `${mins} ${mins === 1 ? 'minuto' : 'minutos'}`;

  const time = `${hours}:${mins.toString().padStart(2, '0')}hs`;
  return withDetails ? `${hoursInWords} y ${minutesInWords}` : time;
};

export function formatPrice(price: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(price);
}

export function isTodayOrRecent(
  dateString: string,
  numDaysAgo: number = 0
): boolean {
  const date = parseISO(dateString);
  const today = new Date();
  const recentDate = addDays(today, -numDaysAgo);
  // return isBefore(date, today) && isAfter(date, recentDate);
  return isToday(date) || isAfter(date, recentDate);
}

/** change "00:00:00" to minutes, ex: "00:30:00" => 30min */
export function convertToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

/** convert "00:00:00" to Date */
export function timeToDate(timeString: string): Date {
  const [hours, minutes, seconds] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  date.setSeconds(parseInt(seconds, 10));
  return date;
}

export function doesOverlap(
  schedules: ScheduleWithAvailable[],
  startInMinutes: number,
  endInMinutes: number,
  excludeId?: string
): boolean {
  const listSchedules = excludeId
    ? schedules.filter((schedule) => schedule.id !== excludeId)
    : schedules;

  return listSchedules?.some((schedule) => {
    if (!schedule.active) return false;

    const existingStartInMinutes = convertToMinutes(schedule.startTime);
    const existingEndInMinutes = convertToMinutes(schedule.endTime);

    const existingRange = {
      start: existingStartInMinutes,
      end:
        existingEndInMinutes >= existingStartInMinutes
          ? existingEndInMinutes
          : existingEndInMinutes + 1440 // this is for when the end time is before the start time
    };

    const newRange = {
      start: startInMinutes,
      end: endInMinutes >= startInMinutes ? endInMinutes : endInMinutes + 1440
    };

    // verify if the new range overlaps with the existing range
    return (
      newRange.start < existingRange.end && newRange.end > existingRange.start
    );
  });
}
