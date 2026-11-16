'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { GetActivityLogsResponse } from '@/lib/types/activity-log.type';
import fetchHelper from '../fetchHelper';

export interface ActivityLogQueryParams {
  search_param?: string;
  module?: string;
  action?: string;
  page?: string | number;
  per_page?: string | number;
  with_pagination?: string;
  date_range?: string;
  created_at_date_range?: string;
  [key: string]: any;
}

interface Options
  extends Omit<
    UseQueryOptions<GetActivityLogsResponse>,
    'queryKey' | 'queryFn'
  > {
  params?: ActivityLogQueryParams;
}

const useGetActivityLogs = (options?: Options) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.ACTIVITY_LOG, options?.params],
    async queryFn() {
      const searchParams = new URLSearchParams();
      if (options?.params) {
        Object.entries(options.params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') {
            searchParams.append(key, String(val));
          }
        });
      }
      const queryString = searchParams.toString();
      const endpoint = `/activity-log${queryString ? `?${queryString}` : ''}`;
      const res = await fetchHelper<GetActivityLogsResponse>(endpoint);

      return res;
    },
  });
};

export default useGetActivityLogs;
