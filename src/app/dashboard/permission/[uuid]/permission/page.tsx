'use client';

import { use, useMemo } from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetRole from '@/services/permission/useGetRole';

import PermissionTable from './_components/PermissionTable';

const Page = ({ params: paramsPromise }: { params: Promise<{ uuid: string }> }) => {
  const params = use(paramsPromise);

  const { uuid } = params;

  const { data } = useGetRole(uuid);

  const breadcrumbs = useMemo(() => {
    return [
      {
        label: 'Dashboard',
        href: '/dashboard/admin',
      },
      {
        label: 'Role',
        href: '/dashboard/permission',
      },
      {
        label: data?.name || 'Role',
        href: data?.code.startsWith('master_admin') ? '#' : `/dashboard/permission/${data?.uuid}`,
      },
      {
        label: 'Permission',
      },
    ];
  }, [data]);

  if (data?.code.startsWith('master_admin')) {
    return <div>Master admin role cannot be edited.</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <DashboardTitle
        title="Permission Configuration"
        subTitle="Configure the permissions for the role."
        breadcrumbs={breadcrumbs}
      />

      <PermissionTable uuid={uuid} />
    </div>
  );
};

export default Page;
