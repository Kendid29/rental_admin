'use client';

import Link from 'next/link';

import { Button } from '@mui/material';

import { Edit, PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { usePermission } from '@/services/permission/usePermission';

import RoomsAndPricingCalendar from './_components/calendar';
import RoomsAndPricingTable from './_components/RoomsAndPricingTable';

const Page = () => {
  const { isZh } = useTranslation();
  const checkPermission = usePermission();

  const breadcrumbs = [
    {
      label: 'Rooms and Pricing',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Rooms and Pricing List"
          subTitle="Manage your rooms and pricing here."
          breadcrumbs={breadcrumbs}
        >
          <div className="flex gap-4">
            {checkPermission('room_pricing', 'Update') && (
              <Button
                LinkComponent={Link}
                href={'/dashboard/rooms-and-pricing/bulk-edit'}
                variant="outlined"
                color="primary"
                startIcon={<Edit size={'1rem'} />}
              >
                {isZh ? '批量修改房间与价格' : 'Bulk Edit Room and Pricing'}
              </Button>
            )}
            {checkPermission('room_pricing', 'Create') && (
              <Button
                LinkComponent={Link}
                href={'/dashboard/rooms-and-pricing/new'}
                variant="contained"
                color="primary"
                startIcon={<PlusCircle size={'1rem'} />}
              >
                {isZh ? '新增房间与价格' : 'New Room and Pricing'}
              </Button>
            )}
          </div>
        </DashboardTitle>

        <RoomsAndPricingCalendar />
      </div>
    </>
  );
};

export default Page;
