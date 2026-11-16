import { type ClassValue, clsx } from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { twMerge } from 'tailwind-merge';

// import type { ResponseError } from '../react-query/service/types';

// export const isResponseError = (error: unknown): error is ResponseError => {
//   if (error && typeof error === 'object' && ('code' in error || 'error' in error)) {
//     return true;
//   }
//   return false;
// };

// Extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);

export const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `${r}, ${g}, ${b}`;
};

/**
 * Combines class names using clsx and merges them with Tailwind classes.
 * @param {...ClassValue} inputs The class values to be combined.
 * @returns {string} The combined class names.
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

export const createPaginate = <T>(data: T[] | undefined, currentPage: number, pageSize: number) => {
  if (!data) return [];
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);

  return data.slice(startIndex, endIndex);
};

/**
 * Paginate an array
 * @param {Array} items The array of items to paginate.
 * @param {number} currentPage The current page number (1-indexed).
 * @param {number} pageSize The number of items per page.
 * @returns {Array} The items on the current page.
 */
export const paginateArray = <T>(items: T[], currentPage: number, pageSize = 10): T[] => {
  const offset = (currentPage - 1) * pageSize;

  return items.slice(offset, offset + pageSize);
};

/**
 * Convert a Blob to a base64 string
 * @param {Blob} blob The Blob to convert.
 * @returns {Promise<string>} The base64 string.
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Download a file
 * @param {Blob} blob The Blob to download.
 * @param {string} filename The name of the file.
 * @returns {void}
 */
export const downloadFile = (blob: Blob, filename: string) => {
  const link = document.createElement('a');

  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Get value of object by dynamic path
 * @param {Record<string, any>} object The object to get the value from.
 * @param {string} path The path to the value.
 * @returns {any} The value.
 * @example
 * getValueByPath({ a: { b: { c: 1 } } }, 'a.b.c') // 1
 *
 */
export const getValueByPath = (object: Record<string, any>, path: string): any => {
  return path.split('.').reduce((obj, key) => (obj ? obj[key] : null), object);
};

/**
 * Get the array of dates between two dates
 * @param {string} startDate Start date.
 * @param {string} endDate End date.
 * @returns {number} The difference in days.
 */
export const getDateRangeArray = (startDate: string | number, endDate: string | number) => {
  let start = dayjs(startDate);
  const end = dayjs(endDate);
  const dateArray = [];

  while (start.isBefore(end) || start.isSame(end)) {
    dateArray.push(start.format('YYYY-MM-DD'));
    start = start.add(1, 'day');
  }

  return dateArray;
};

/**
 * parse date range to unix timestamp
 * @param {string} dateRange Date range.
 * @returns {string} The unix timestamp.
 * @example
 * parseDateRangeUnix('2021-01-01 to 2021-01-02') // 1609459200 to 1609545600
 *
 */
export const parseDateRangeUnix = (dateRange: string) => {
  const dates = dateRange.split(' to ');

  if (dates.length !== 2) return '';

  return `${dayjs(`${dates[0]}T00:00:00Z`).utc().unix()} to ${dayjs(`${dates[1]}T00:00:00Z`)
    .utc()
    .unix()}`;
};

/**
 * Transform an array of path segments into a breadcrumb-style path array
 * @param {string[]} segments Array of path segments
 * @returns {string[]} Array of cumulative paths
 * @example
 * createPathArray(['dashboard', 'user', 'detail']) // ['dashboard', 'dashboard/user', 'dashboard/user/detail']
 *
 */
export const createPathArray = (segments: string[]): string[] => {
  return segments.map((_, index) => {
    return segments.slice(0, index + 1).join('/');
  });
};

/**
 * Get relative time from a date (e.g., "2 days ago", "in 3 hours")
 * @param {string | Date | dayjs.Dayjs} date The date to get relative time from
 * @param {boolean} withoutSuffix If true, returns without "ago" or "in" suffix
 * @returns {string} Relative time string
 */
export const getRelativeTime = (
  date: string | Date | dayjs.Dayjs,
  withoutSuffix = false,
): string => {
  return dayjs(date).fromNow(withoutSuffix);
};

/**
 * Get relative time to a future date (e.g., "in 2 days", "in 3 hours")
 * @param {string | Date | dayjs.Dayjs} date The future date
 * @param {boolean} withoutSuffix If true, returns without "in" suffix
 * @returns {string} Relative time string
 */
export const getTimeUntil = (date: string | Date | dayjs.Dayjs, withoutSuffix = false): string => {
  return dayjs(date).fromNow(withoutSuffix);
};

/**
 * Get countdown between two dates
 * @param {string | Date | dayjs.Dayjs} fromDate Start date
 * @param {string | Date | dayjs.Dayjs} toDate End date
 * @param {'day' | 'hour' | 'minute' | 'second'} unit Time unit
 * @returns {number} Number of units between dates
 */
export const getCountdown = (
  fromDate: string | Date | dayjs.Dayjs,
  toDate: string | Date | dayjs.Dayjs,
  unit: 'day' | 'hour' | 'minute' | 'second' = 'day',
): number => {
  return dayjs(toDate).diff(dayjs(fromDate), unit);
};
