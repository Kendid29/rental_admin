'use client';

import React, { use } from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetVillaClass from '@/services/villa-class/useGetVillaClass';
import useUpdateVillaClass from '@/services/villa-class/useUpdateVillaClass';

import VillaClassForm from '../_components/VillaClassForm';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const { data, isLoading } = useGetVillaClass(uuid);

  const { mutate, isPending } = useUpdateVillaClass(uuid);

  const handleSubmit = (formData: any, ...rest: any[]) => {
    const newData = { ...formData };

    if (typeof formData.thumbnail_uuid === 'string') {
      newData.thumbnail_uuid = data?.thumbnail?.uuid || '';
    }

    if (Array.isArray(formData.images)) {
      newData.images = formData.images.map((d: any) => {
        if (typeof d === 'string') {
          const existing = data?.images?.find(
            (img: any) => img.url === d || img.uuid === d || img === d,
          );
          return existing?.uuid || d;
        }
        return d;
      });
    }

    mutate(newData, ...rest);
  };

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Edit Villa"
          subTitle="Edit your villa here."
          breadcrumbs={[
            {
              label: 'Villa',
              href: '/dashboard/villa-class',
            },
            {
              label: 'Edit Villa',
            },
          ]}
        />

        <VillaClassForm
          onSubmit={(d) => handleSubmit(d)}
          initialValues={
            data && {
              name: data.name,
              code: data.code || '',
              description: data.description || '',
              address: data.address || '',
              latitude: data.latitude || '',
              longitude: data.longitude || '',
              max_guest: Number(data.max_guest) || 0,
              check_in_time: data.check_in_time ? data.check_in_time.slice(0, 5) : '14:00',
              check_out_time: data.check_out_time ? data.check_out_time.slice(0, 5) : '12:00',
              is_active: !!data.is_active,
              thumbnail_uuid: data.thumbnail?.url || null,
              images: Array.isArray(data.images)
                ? data.images.map((img: any) => (typeof img === 'string' ? img : img.url || img.uuid))
                : [],
              version: data.version,
            }
          }
          isLoading={isPending || isLoading}
        />
      </div>
    </>
  );
};

export default Page;
