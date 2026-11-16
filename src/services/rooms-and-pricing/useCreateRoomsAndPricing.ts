import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import dayjs from 'dayjs';
import _ from 'lodash';
import { toast } from 'react-toastify';

import { getActiveDayByRepeatOn } from '@/app/dashboard/rooms-and-pricing/_utils';
import {
  RoomDateFormType,
  RoomsAndPricingFormType,
} from '@/app/dashboard/rooms-and-pricing/_utils/rooms-and-pricing-schema';
import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

export const parseDateRange = (data: RoomDateFormType[]) => {
  return _.flatMap(data, ({ date, quantity, repeat_on }) => {
    const dates = date.split(' to ');

    if (dates[0] === dates[1]) {
      return { date: dates[0], quantity };
    }

    const totalDays = dayjs(dates[1]).diff(dayjs(dates[0]), 'day') + 1;

    return _.range(totalDays)
      .map((day) => ({
        date: dayjs(dates[0]).add(day, 'day').format('YYYY-MM-DD'),
        quantity,
      }))
      .filter(({ date: dateString }) => getActiveDayByRepeatOn(repeat_on, dayjs(dateString)));
  });
};

const useCreateRoomsAndPricing = (
  options?: UseMutationOptions<any, unknown, RoomsAndPricingFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) => {
      const {
        pricing_type,
        villa_class_uuid,
        room_type_uuid,
        dates,
        base_price,
        selling_price,
        agent_price,
        max_adult,
        max_child,
        rooms,
        addons,
        ...restData
      } = data;

      const parsedDates = parseDateRange(dates);
      const parsedAddons = (addons || []).map((addon) => ({
        addon_uuid: addon.addon_uuid,
        price_tiers: (addon.price_tiers || []).map((tier) => ({
          from_quantity: Number(tier.from_quantity),
          to_quantity: Number(tier.to_quantity),
          price: Number(tier.price),
          agent_price: Number(tier.agent_price),
        })),
      }));

      if (pricing_type === 'villa') {
        const parsedRooms = (rooms || []).map((room) => ({
          room_type_uuid: room.room_type_uuid,
          base_price: Number(room.base_price),
          selling_price: Number(room.selling_price),
          agent_price: Number(room.agent_price),
          max_adult: Number(room.max_adult),
          max_child: Number(room.max_child),
        }));

        return fetchHelper('/room/pricing/create', 'POST', {
          ...restData,
          villa_uuid: villa_class_uuid,
          villa_base_price: Number(base_price),
          villa_selling_price: Number(selling_price),
          villa_agent_price: Number(agent_price),
          villa_max_adult: Number(max_adult),
          villa_max_child: Number(max_child),
          max_adult: Number(max_adult),
          max_child: Number(max_child),
          dates: parsedDates,
          rooms: parsedRooms,
          addons: parsedAddons,
        });
      } else {
        return fetchHelper('/room/pricing/create', 'POST', {
          ...restData,
          room_type_uuid,
          base_price: Number(base_price),
          selling_price: Number(selling_price),
          agent_price: Number(agent_price),
          max_adult: Number(max_adult),
          max_child: Number(max_child),
          dates: parsedDates,
          addons: parsedAddons,
        });
      }
    },
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.ROOMS_AND_PRICING] });
      toast('Room and pricing created successfully', { type: 'success' });

      router.push('/dashboard/rooms-and-pricing');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useCreateRoomsAndPricing;
