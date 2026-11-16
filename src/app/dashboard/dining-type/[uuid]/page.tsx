'use client';

import React, { use } from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetDiningType from '@/services/dining-type/useGetDiningType';
import useUpdateDiningType from '@/services/dining-type/useUpdateDiningType';

import DiningTypeForm from '../_components/DiningTypeForm';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const { data, isLoading } = useGetDiningType(uuid);

  const { mutate, isPending } = useUpdateDiningType(uuid);

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Edit Dining Type"
          subTitle="Edit your dining type here."
          breadcrumbs={[
            {
              label: 'Dining Type',
              href: '/dashboard/dining-type',
            },
            {
              label: 'Edit Dining Type',
            },
          ]}
        />

        <DiningTypeForm
          onSubmit={(d, options) => mutate(d, options)}
          // initialValues={
          //   data && {
          //     name: data.name,
          //     code: data.code || '',
          //     description: data.description || '',
          //     version: data.version,
          //   }
          // }
          isLoading={isPending || isLoading}
        />
      </div>
    </>
  );
};

export default Page;
