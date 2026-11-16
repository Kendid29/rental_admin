'use client';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useBulkUpdateRoomsAndPricing from '@/services/rooms-and-pricing/useBulkUpdateRoomsAndPricing';

import RoomsAndPricingBulkEditForm from './_components/RoomsAndPricingBulkEditForm';

const Page = () => {
  const { mutate, isPending } = useBulkUpdateRoomsAndPricing();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Bulk Edit Room and Pricing"
          subTitle="Edit your room and pricing here."
          breadcrumbs={[
            {
              label: 'Rooms and Pricing',
              href: '/dashboard/rooms-and-pricing',
            },
            {
              label: 'Bulk Edit Room and Pricing',
            },
          ]}
        />

        <RoomsAndPricingBulkEditForm
          onSubmit={(d, options) => mutate(d, options)}
          isLoading={isPending}
        />
      </div>
    </>
  );
};

export default Page;
