'use client';

import React, { use } from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetVoucherCategory from '@/services/voucher-category/useGetVoucherCategory';
import useUpdateVoucherCategory from '@/services/voucher-category/useUpdateVoucherCategory';

import VoucherCategoryForm from '../_components/VoucherCategoryForm';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const { data, isLoading } = useGetVoucherCategory(uuid);

  const { mutate, isPending } = useUpdateVoucherCategory(uuid);

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Edit Voucher Category"
          subTitle="Edit your voucher category here."
          breadcrumbs={[
            {
              label: 'Voucher Category',
              href: '/dashboard/voucher-category',
            },
            {
              label: 'Edit Voucher Category',
            },
          ]}
        />

        <VoucherCategoryForm
          onSubmit={mutate}
          initialValues={
            data && {
              name: data.name,
              code: data.code,
              description: data.description || '',
              version: data.version,
              queue: data.queue,
              is_published: !!data.is_published,
              is_published_cms: !!data.is_published_cms,
            }
          }
          isLoading={isPending || isLoading}
        />
      </div>
    </>
  );
};

export default Page;
