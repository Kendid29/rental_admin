'use client';

import React, { use } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'react-toastify';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetAdmin from '@/services/admin/useGetAdmin';
import useUpdateAdmin from '@/services/admin/useUpdateAdmin';

import AdminForm from '../_components/AdminForm';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const router = useRouter();
  const { uuid } = use(params);

  const { data: admin, isLoading } = useGetAdmin(uuid);

  const { mutate, isPending } = useUpdateAdmin(uuid, {
    onSuccess() {
      toast('Admin berhasil diperbarui', { type: 'success' });
      router.push('/dashboard/admin');
    },
  });

  const breadcrumbs = [
    {
      label: 'Admin',
      href: '/dashboard/admin',
    },
    {
      label: 'Edit Admin',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Edit Admin"
          subTitle="Perbarui informasi dan peran administrator."
          breadcrumbs={breadcrumbs}
        />

        <AdminForm
          onSubmit={mutate}
          initialValues={
            admin && {
              email: admin.user?.email || '',
              name: admin.name || '',
              role_uuid: admin.role?.uuid,
              phone_number: admin.phone_number || '',
              status: admin.status || 'aktif',
              password: '',
              password_confirmation: '',
              version: admin.version,
              user_information_version: admin.user?.version,
              user_information_uuid: admin.user?.uuid,
            }
          }
          isLoading={isPending || isLoading}
        />
      </div>
    </>
  );
};

export default Page;
