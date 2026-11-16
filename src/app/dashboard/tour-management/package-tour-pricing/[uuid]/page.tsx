'use client';

import React, { use } from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetPackageTourPricing from '@/services/package-tour-pricing/useGetPackageTourPricing';
import useUpdatePackageTourPricing from '@/services/package-tour-pricing/useUpdatePackageTourPricing';

import PackageTourPricingForm from '../_components/PackageTourPricingForm';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const { data, isLoading } = useGetPackageTourPricing(uuid);

  const { mutate, isPending } = useUpdatePackageTourPricing(uuid);

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Edit Package Tour Pricing"
          subTitle="Edit your package tour pricing here."
          breadcrumbs={[
            {
              label: 'Package Tour Pricing',
              href: '/dashboard/tour-management/package-tour-pricing',
            },
            {
              label: 'Edit Package Tour Pricing',
            },
          ]}
        />

        <PackageTourPricingForm
          onSubmit={(d, options) => mutate(d, options)}
          initialValues={
            data && {
              package_tour_pricing_uuid: data.uuid,
              package_tour_uuid: data.package_tour?.uuid,
              villa_class_uuid: data.villa_class?.uuid || '',
              min_qty: data.min_qty || 1,
              description: data.description || '',
              price_ranges: data.price_ranges?.map((range) => ({
                from_quantity: range.from_quantity,
                to_quantity: range.to_quantity,
                price: range.price,
                agent_price: range.agent_price,
              })) || [{ from_quantity: 1, to_quantity: 1, price: 0, agent_price: 0 }],
              date: data.date || '',
              dates: data.date
                ? [
                    {
                      date: data.date,
                      repeat_on: 'all_days',
                      quantity: data.quantity || 0,
                    },
                  ]
                : [],
              is_published: data.is_published,
              is_refundable: data.is_refundable,
              is_transferable: data.is_transferable,
              is_cancellable: data.is_cancellable,
              is_rescheduleable: data.is_rescheduleable,
              version: data.version,
              base_price: data.base_price || 0,
              selling_price: data.selling_price || 0,
              agent_price: data.agent_price || 0,
              quantity: data.quantity || 1,
            }
          }
          isLoading={isPending || isLoading}
          isEdit
        />
      </div>
    </>
  );
};

export default Page;
