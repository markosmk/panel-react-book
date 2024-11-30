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
  return format(date, formatStr, { locale: es });
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

export function formatDateFriendly(dateString: string) {
  const date = parseISO(dateString);
  return formatDistanceToNow(date, { addSuffix: true, locale: es });
}

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
