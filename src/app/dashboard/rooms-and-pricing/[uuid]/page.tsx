'use client';

import React, { use } from 'react';

import dayjs from 'dayjs';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetRoomsAndPricing from '@/services/rooms-and-pricing/useGetRoomsAndPricing';
import useUpdateRoomsAndPricing from '@/services/rooms-and-pricing/useUpdateRoomsAndPricing';
import useGetRoomTypes from '@/services/room-type/useGetRoomTypes';

import RoomsAndPricingForm from '../_components/RoomsAndPricingForm';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const { data, isLoading } = useGetRoomsAndPricing(uuid);
  const { data: roomTypesData, isLoading: isLoadingRoomTypes } = useGetRoomTypes();

  const { mutate, isPending } = useUpdateRoomsAndPricing(uuid);

  const roomRows = data?.rooms || [];
  const firstRoom = roomRows[0];

  const matchingRoomType = roomTypesData?.data?.find(
    (rt) => rt.uuid === (data?.room_type?.uuid || firstRoom?.room_type?.uuid),
  );
  const resolvedVillaClassUuid =
    matchingRoomType?.villa?.uuid || matchingRoomType?.room_category?.uuid || '';

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Edit Room and Pricing"
          subTitle="Edit your room and pricing here."
          breadcrumbs={[
            {
              label: 'Rooms and Pricing',
              href: '/dashboard/rooms-and-pricing',
            },
            {
              label: 'Edit Room and Pricing',
            },
          ]}
        />

        <RoomsAndPricingForm
          onSubmit={(d, options) => mutate(d, options)}
          initialValues={
            data && {
              pricing_type: data.villa_base_price !== null && data.villa_base_price !== undefined ? 'villa' : 'room_type',
              villa_class_uuid:
                data.villa_class_uuid || data.villa_class?.uuid || resolvedVillaClassUuid || '',
              room_type_uuid: data.room_type?.uuid || firstRoom?.room_type?.uuid || '',
              dates: [
                {
                  date: dayjs(data.date).format('YYYY-MM-DD'),
                  quantity: data.quantity,
                  repeat_on: 'all_days',
                },
              ],
              base_price: Number(
                data.villa_base_price !== null && data.villa_base_price !== undefined
                  ? data.villa_base_price
                  : data.base_price || 0
              ),
              selling_price: Number(
                data.villa_base_price !== null && data.villa_base_price !== undefined
                  ? data.villa_selling_price
                  : data.selling_price || 0
              ),
              agent_price: Number(
                data.villa_base_price !== null && data.villa_base_price !== undefined
                  ? data.villa_agent_price
                  : data.agent_price || 0
              ),
              rooms:
                data.villa_base_price !== null && data.villa_base_price !== undefined
                  ? roomRows.map((room) => ({
                      room_type_uuid: room.room_type.uuid,
                      base_price: Number(room.base_price || 0),
                      selling_price: Number(room.selling_price || 0),
                      agent_price: Number(room.agent_price || 0),
                      max_adult: Number(room.max_adult || 0),
                      max_child: Number(room.max_child || 0),
                    }))
                  : [],
              addons: Object.values(
                (data.addons || []).reduce<Record<string, any>>((acc, addon) => {
                  const addonUuid = addon.addon?.uuid;
                  if (!addonUuid) return acc;

                  if (!acc[addonUuid]) {
                    acc[addonUuid] = {
                      ...addon,
                      price_tiers: addon.price_tiers ? [...addon.price_tiers] : [],
                    };
                  } else if (addon.price_tiers) {
                    addon.price_tiers.forEach((tier: any) => {
                      const exists = acc[addonUuid].price_tiers?.some(
                        (t: any) =>
                          t.from_quantity === tier.from_quantity &&
                          t.to_quantity === tier.to_quantity,
                      );
                      if (!exists) {
                        acc[addonUuid].price_tiers?.push(tier);
                      }
                    });
                  }
                  return acc;
                }, {}),
              ).map((addon: any) => ({
                room_pricing_addon_uuid: addon.uuid,
                addon_uuid: addon.addon.uuid,
                price_tiers:
                  addon.price_tiers?.map((tier: any) => ({
                    from_quantity: Number(tier.from_quantity),
                    to_quantity: Number(tier.to_quantity),
                    price: Number(tier.price),
                    agent_price: Number(tier.agent_price),
                  })) || [],
                version: addon.version,
              })),
              max_adult: Number(
                data.villa_base_price !== null && data.villa_base_price !== undefined
                  ? data.villa_max_adult
                  : data.max_adult || 0
              ),
              max_child: Number(
                data.villa_base_price !== null && data.villa_base_price !== undefined
                  ? data.villa_max_child
                  : data.max_child || 0
              ),
              is_breakfast: !!data.feature_highlight?.is_breakfast,
              is_cancellable: !!data.is_cancellable,
              is_rescheduleable: !!data.is_rescheduleable,
              is_published: !!data.is_published,
              version: data.version,
            }
          }
          isLoading={isPending || isLoading || isLoadingRoomTypes}
        />
      </div>
    </>
  );
};

export default Page;

