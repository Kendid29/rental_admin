'use client';

import React from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreateVoucherCategory from '@/services/voucher-category/useCreateVoucherCategory';

import VoucherCategoryForm from '../_components/VoucherCategoryForm';

const Page = () => {
  const { mutate, isPending } = useCreateVoucherCategory();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Create New Voucher Category"
          subTitle="Create a new voucher category here."
          breadcrumbs={[
            {
              label: 'Voucher Category',
              href: '/dashboard/voucher-category',
            },
            {
              label: 'New Voucher Category',
            },
          ]}
        />

        <VoucherCategoryForm onSubmit={mutate} isLoading={isPending} />
      </div>
    </>
  );
};

export default Page;
