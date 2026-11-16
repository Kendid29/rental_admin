'use client';

import axios, { AxiosError } from 'axios';
import { deleteCookie, getCookie } from 'cookies-next/client';

import { baseURL, clientVersion, devBearerToken, useMockApi } from '@/constant';
import { getQueryCLient } from '@/provider/ReactQueryProvider';
import { handleMockRequest } from '@/services/mock/router';

const isMockApiEnabled = useMockApi;
const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENVIRONMENT === 'development';

const fetchHelper = async <T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: BodyInit | null | any,
  headers?: Record<string, string>,
) => {
  if (isMockApiEnabled) {
    return handleMockRequest(url, method, data);
  }

  const headerInit: Record<string, string> = headers || {};
  let body: BodyInit | null;

  if (data instanceof FormData) {
    body = data;
  } else {
    headerInit['Content-Type'] = 'application/json';
    body = JSON.stringify(data);
  }

  try {
    const tokenFromCookie = getCookie('grd_token');
    const devToken = devBearerToken || '';

    const response = await axios.request({
      url: `${baseURL}${url}`,
      method,
      data: body,
      // cache: 'no-store',
      headers: {
        Authorization: `Bearer ${tokenFromCookie || (isDevelopment && devToken ? devToken : '')}`,
        'x-client-version': clientVersion || '',
        ...headerInit,
      },
    });

    return response.data;
  } catch (error: unknown) {
    const pathname = window?.location?.pathname;
    const queryClient = getQueryCLient();
    const axiosError = error as AxiosError<any>;

    if (axiosError?.response?.status === 401 && url !== '/login' && getCookie('grd_token')) {
      deleteCookie('grd_token');
      window.location.href = `/login${pathname ? `?fallback=${pathname}` : ''}`;

      queryClient.cancelQueries();
    }
    throw error;
  }
};

export default fetchHelper;

