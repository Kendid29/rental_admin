'use client';

import React, { use } from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetPackageTour from '@/services/package-tour/useGetPackageTour';
import useUpdatePackageTour from '@/services/package-tour/useUpdatePackageTour';

import PackageTourForm from '../_components/PackageTourForm';
import { PackageTourFormType } from '../_utils/package-tour-schema';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const { data, isLoading } = useGetPackageTour(uuid);

  const { mutate, isPending } = useUpdatePackageTour(uuid);

  const handleSubmit = (d: PackageTourFormType, ...rest: any[]) => {
    const newData: any = { ...d };

    if (typeof d.image_uuid === 'string') {
      newData.image_uuid = data?.image_uuid || '';
    }

    mutate(newData, ...rest);
  };

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Edit Package Tour"
          subTitle="Edit your package tour here."
          breadcrumbs={[
            {
              label: 'Package Tour',
              href: '/dashboard/tour-management/package-tour',
            },
            {
              label: 'Edit Package Tour',
            },
          ]}
        />

        <PackageTourForm
          onSubmit={(d) => handleSubmit(d)}
          initialValues={
            data && {
              name: data.name,
              code: data.code || '',
              description: data.description || '',
              is_active: data.is_active,
              image_uuid: data.image?.url || '',
              quantity: data.quantity,
              current_quantity: data.current_quantity,
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
