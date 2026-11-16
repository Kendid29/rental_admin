import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { PackageTourPricingFormType } from '@/app/dashboard/tour-management/package-tour-pricing/_utils/package-tour-pricing-schema';
import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import dayjs from 'dayjs';

import fetchHelper from '../fetchHelper';

const useCreatePackageTourPricing = (
  options?: UseMutationOptions<any, unknown, PackageTourPricingFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) => {
      const { villa_class_uuid, price_ranges, dates, ...restData } = data;
      const firstRange = price_ranges?.[0];
      return fetchHelper('/master-data/package-tour/pricing/create', 'POST', {
        ...restData,
        villa_uuid: villa_class_uuid,
        base_price: firstRange?.price || 0,
        agent_price: firstRange?.agent_price || 0,
        dates: (dates as any[])?.flatMap(({ date, quantity, repeat_on }) => {
          const splitDates = date.split(' to ');
          if (splitDates[0] === splitDates[1] || splitDates.length === 1) {
            return { date: splitDates[0], quantity };
          }
          const totalDays = dayjs(splitDates[1]).diff(dayjs(splitDates[0]), 'day') + 1;
          const { getActiveDayByRepeatOn } = require('@/app/dashboard/rooms-and-pricing/_utils');
          return Array.from({ length: totalDays }).map((_, day) => ({
            date: dayjs(splitDates[0]).add(day, 'day').format('YYYY-MM-DD'),
            quantity,
          })).filter(({ date: dateString }) => getActiveDayByRepeatOn(repeat_on, dayjs(dateString)));
        }),
        price_ranges: price_ranges?.map((range) => ({
          from_quantity: range.from_quantity,
          to_quantity: range.to_quantity,
          price: range.price,
          agent_price: range.agent_price,
        })) || [],
      });
    },
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.PACKAGE_TOUR_PRICING] });
      toast('Package Tour pricing created successfully', { type: 'success' });

      router.push('/dashboard/tour-management/package-tour-pricing');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useCreatePackageTourPricing;

