'use client';

import Link from 'next/link';

import { Button } from '@mui/material';

import { Edit, PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { usePermission } from '@/services/permission/usePermission';

import PackageTourPricingCalendar from './_components/calendar';

const Page = () => {
  const checkPermission = usePermission();

  const breadcrumbs = [
    {
      label: 'Package Tour Pricing',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Package Tour Pricing List"
          subTitle="Manage your Package Tour pricings here."
          breadcrumbs={breadcrumbs}
        >
          <div className="flex gap-4">
            {checkPermission('package_tour_pricing', 'Update') && (
              <Button
                LinkComponent={Link}
                href={'/dashboard/tour-management/package-tour-pricing/bulk-edit'}
                variant="outlined"
                color="primary"
                startIcon={<Edit size={'1rem'} />}
              >
                Bulk Edit Package Tour Pricing
              </Button>
            )}
            {checkPermission('package_tour_pricing', 'Create') && (
              <Button
                LinkComponent={Link}
                href={'/dashboard/tour-management/package-tour-pricing/new'}
                variant="contained"
                color="primary"
                startIcon={<PlusCircle size={'1rem'} />}
              >
                New Package Tour Pricing
              </Button>
            )}
          </div>
        </DashboardTitle>

        <PackageTourPricingCalendar />
      </div>
    </>
  );
};

export default Page;
