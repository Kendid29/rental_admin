import { setCookie } from 'cookies-next/client';

/**
 * Splits a long string into multiple cookies
 * @param {string} name Base name for the cookie
 * @param {string} value Long string to store
 * @param {number} chunkSize Max size per chunk (default 3800 to be safe)
 * @param {number} days Expiration in days
 * @returns {void}
 */
export const setSplitCookie = (name: string, value: string, chunkSize = 3800, days = 7): void => {
  const numChunks = Math.ceil(value.length / chunkSize);

  for (let i = 0; i < numChunks; i++) {
    const chunk = value.slice(i * chunkSize, (i + 1) * chunkSize);

    setCookie(`${name}_${i}`, chunk, {
      sameSite: 'strict',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * days, // 7 days
    });
  }

  // Store metadata (number of chunks)
  setCookie(`${name}_count`, numChunks, {
    sameSite: 'strict',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * days, // 7 days
  });
};
