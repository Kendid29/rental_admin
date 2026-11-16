import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { RoomsAndPricingFormType } from '@/app/dashboard/rooms-and-pricing/_utils/rooms-and-pricing-schema';
import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

const useUpdateRoomsAndPricing = (
  uuid: string,
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

      const parsedDates = [
        {
          date: dates[0].date,
          quantity: Number(dates[0].quantity),
        },
      ];

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

        return fetchHelper(`/room/pricing/${uuid}/edit`, 'PUT', {
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
        return fetchHelper(`/room/pricing/${uuid}/edit`, 'PUT', {
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
      queryClient.invalidateQueries({ queryKey: [TAGS.ROOMS_AND_PRICING, uuid] });
      toast('Room and pricing updated successfully', { type: 'success' });

      router.push('/dashboard/rooms-and-pricing');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useUpdateRoomsAndPricing;
