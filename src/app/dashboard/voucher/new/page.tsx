'use client';

import React from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreateVoucher from '@/services/voucher/useCreateVoucher';

import VoucherForm from '../_components/VoucherForm';

const Page = () => {
  const { mutate, isPending } = useCreateVoucher();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Create New Voucher"
          subTitle="Create a new voucher here."
          breadcrumbs={[
            {
              label: 'Voucher',
              href: '/dashboard/voucher',
            },
            {
              label: 'New Voucher',
            },
          ]}
        />

        <VoucherForm onSubmit={(d, options) => mutate(d, options)} isLoading={isPending} />
      </div>
    </>
  );
};

export default Page;
