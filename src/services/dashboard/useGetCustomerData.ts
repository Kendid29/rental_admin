import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { CustomerDataType } from '@/lib/types/dashboard.type';
import { ResponseWrapperType } from '@/lib/types/globals';

import fetchHelper from '../fetchHelper';

interface ParamsType extends Record<string, string> {
  type: 'booking_window' | 'length_of_stay' | 'check_in_day';
}

interface Options extends Omit<UseQueryOptions<CustomerDataType[]>, 'queryKey'> {
  params?: ParamsType;
}

const useGetCustomerData = (options?: Options) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.CUSTOMER_DATA, options?.params],
    async queryFn() {
      const res = await fetchHelper(
        `/dashboard/customer-data?${new URLSearchParams(options?.params)}`,
      ).then((r) => r.data);

      if (options?.params?.type === 'booking_window') {
        return res.map((item: any) => ({
          label: item.booking_window_category,
          value: item.total_bookings,
        }));
      }

      if (options?.params?.type === 'length_of_stay') {
        return res.map((item: any) => ({
          label: item.length_of_stay_category,
          value: item.total_bookings,
        }));
      }

      if (options?.params?.type === 'check_in_day') {
        return res.map((item: any) => ({
          label: item.check_in_day,
          value: item.total_check_ins,
        }));
      }

      return [];
    },
  });
};

export default useGetCustomerData;
