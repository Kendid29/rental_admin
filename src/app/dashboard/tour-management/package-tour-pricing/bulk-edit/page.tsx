'use client';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useBulkUpdatePackageTourPricing from '@/services/package-tour-pricing/useBulkUpdatePackageTourPricing';

import PackageTourPricingBulkEditForm from './_components/PackageTourPricingBulkEditForm';

const Page = () => {
  const { mutate, isPending } = useBulkUpdatePackageTourPricing();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Bulk Edit Package Tour Pricing"
          subTitle="Edit your Package Tour pricing here."
          breadcrumbs={[
            {
              label: 'Package Tour Pricing',
              href: '/dashboard/tour-management/package-tour-pricing',
            },
            {
              label: 'Bulk Edit Package Tour Pricing',
            },
          ]}
        />

        <PackageTourPricingBulkEditForm
          onSubmit={(d, options) => mutate(d, options)}
          isLoading={isPending}
        />
      </div>
    </>
  );
};

export default Page;
