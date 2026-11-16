'use client';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { useTranslation } from '@/lib/hooks/useTranslation';

import BookingChartOverview from './_components/BookingChartOverview';
import BookingOverview from './_components/BookingOverview';
import BusinessOverview from './_components/BusinessOverview';
import CustomerData from './_components/CustomerData';
import PromoPerformanceChart from './_components/PromoPerformanceChart';

const Page = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-8xl mx-auto flex w-full flex-col gap-8 pb-12">
      <div className="mt-6 -mb-10 flex items-center gap-4 md:mt-12 md:-mb-6">
        <DashboardTitle
          className="font-public_sans_c60ea187-module__sSAxIW__className"
          title={t.dashboard.welcomeBack}
        />
      </div>

      <BookingChartOverview />

      <div className="grid min-w-0 grid-cols-12 gap-8">
        <div className="col-span-12 -mb-8 min-w-0!">
          <DashboardTitle
            title={t.dashboard.bookingDashboard}
            subTitle={t.dashboard.manageBookingsSubtitle}
          />
        </div>

        <BookingOverview />
        <BusinessOverview />

        <PromoPerformanceChart />
        <CustomerData />
      </div>
    </div>
  );
};

export default Page;
