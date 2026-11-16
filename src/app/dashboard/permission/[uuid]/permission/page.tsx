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
        label: 'Role & Permission',
        href: '/dashboard/permission',
      },
      {
        label: data?.name || 'Role',
        href: data?.code.startsWith('master_admin') ? '#' : `/dashboard/permission/${data?.uuid}`,
      },
      {
        label: 'Hak Akses',
      },
    ];
  }, [data]);

  if (data?.code.startsWith('master_admin')) {
    return (
      <div className="p-4 text-slate-500">
        Peran Master Admin memiliki semua hak akses secara default dan tidak dapat dimodifikasi.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <DashboardTitle
        title={`Konfigurasi Hak Akses: ${data?.name || ''}`}
        subTitle="Atur matriks hak akses CRUD untuk setiap modul platform Rentalin Aja."
        breadcrumbs={breadcrumbs}
      />

      <PermissionTable uuid={uuid} />
    </div>
  );
};

export default Page;
