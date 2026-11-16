import { JSX } from '@emotion/react/jsx-runtime';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';

import UserTable from './_components/UserTable';

const Page = (): JSX.Element => {
  const breadcrumbs = [
    {
      label: 'User',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="User / Pelanggan"
          subTitle="Kelola data pelanggan dan penyewa pada platform Rentalin Aja."
          breadcrumbs={breadcrumbs}
        />

        <UserTable />
      </div>
    </>
  );
};

export default Page;
