import { ResponseWrapper } from './types';

export const createSuccessResponse = <T>(
  data: T,
  message = 'Success',
  pagination?: any,
): ResponseWrapper<T> => ({
  data,
  success: true,
  message,
  ...(pagination && { pagination }),
});

export const parseQueryParams = (url: string) => {
  const queryString = url.includes('?') ? url.split('?')[1] : '';

  return new URLSearchParams(queryString);
};
