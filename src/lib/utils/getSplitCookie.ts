import { RequestCookies, ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';

/**
 * Reassembles a long string from split cookies used in a Next.js server.
 * @param {RequestCookies} cookies The cookies object containing all cookies.
 * @param {string} name The base name of the split cookies to reassemble.
 * @returns {string|null} The reassembled string or null if any part is missing.
 */
export const getSplitCookie = (cookies: RequestCookies, name: string): string | null => {
  const countKey = `${name}_count`;
  const count = cookies.get(countKey) ? Number(cookies.get(countKey)?.value) : NaN;

  if (Number.isNaN(count)) return null;

  let result = '';

  for (let i = 0; i < count; i++) {
    const part = cookies.get(`${name}_${i}`)?.value;

    if (!part) return null;
    result += part;
  }

  return result;
};

/**
 * Deletes a split cookie from a Next.js server.
 * @param {ResponseCookies} cookies The cookies object containing all cookies.
 * @param {string} name The base name of the split cookies to delete.
 * @returns {void}
 */
export const deleteSplitCookie = (cookies: ResponseCookies, name: string) => {
  const countKey = `${name}_count`;
  const count = cookies.get(countKey) ? Number(cookies.get(countKey)?.value) : NaN;

  cookies.delete(countKey);

  for (let i = 0; i < count; i++) {
    cookies.delete(`${name}_${i}`);
  }
};
