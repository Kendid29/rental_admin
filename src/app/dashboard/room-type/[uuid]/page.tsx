'use client';

import React, { use } from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetRoomType from '@/services/room-type/useGetRoomType';
import useUpdateRoomType from '@/services/room-type/useUpdateRoomType';

import RoomTypeForm from '../_components/RoomTypeForm';
import { RoomTypeFormType } from '../_utils/room-type-schema';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const { data: roomType, isLoading } = useGetRoomType(uuid);
  const { mutate, isPending } = useUpdateRoomType(uuid);

  const handleSubmit = (data: RoomTypeFormType, ...rest: any[]) => {
    const newData = { ...data };

    if (data && data.room_type_images) {
      newData.room_type_images = data.room_type_images
        .map((d) => {
          if (typeof d === 'string') {
            const image = roomType?.room_type_images?.find(
              (img: any) => img.url === d || img.uuid === d,
            );

            return image?.uuid || d;
          }
          return d;
        })
        .filter(Boolean);
    }

    mutate(newData, ...rest);
  };

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Edit Room Type"
          subTitle="Edit your room type here."
          breadcrumbs={[
            {
              label: 'Room Type',
              href: '/dashboard/room-type',
            },
            {
              label: 'Edit Room Type',
            },
          ]}
        />

        <RoomTypeForm
          onSubmit={(d) => handleSubmit(d)}
          isPending={isPending || isLoading}
          initialValues={
            roomType && {
              room_category_uuid: roomType.room_category.uuid,
              total_bed: roomType.total_bed || 0,
              occupancy: roomType.occupancy || 0,
              room_size: Number(roomType.room_size?.replace(' sqm', '')) || 0,
              actual_quantity: roomType.actual_quantity || 0,
              system_use_quantity: roomType.system_use_quantity || 0,
              other_use_quantity: roomType.other_use_quantity || 0,
              is_published_cms: !!roomType.is_published_cms,
              name: roomType.name,
              code: roomType.code || '',
              description: roomType.description || '',
              bed_type: roomType.bed_type,
              bath_type: roomType.bath_type,
              room_type_has_facilities: roomType.room_type_has_facilities.map((d: any) => ({
                [d.uuid]: true,
              })),
              room_type_has_on_request_facilities: roomType.room_type_has_on_request_facilities.map(
                (d: any) => ({
                  [d.uuid]: true,
                }),
              ),
              thumbnail_photo:
                roomType.room_type_images?.[0]?.url || (roomType as any).thumbnail?.url || null,
              gallery_photos:
                (roomType.room_type_images || []).slice(1).map((d: any) => d.url) || [],
              room_type_images: (roomType.room_type_images || []).map((d: any) => d.url),
              version: roomType.version,
            }
          }
        />
      </div>
    </>
  );
};

export default Page;
