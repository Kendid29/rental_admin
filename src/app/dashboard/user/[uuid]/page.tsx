'use client';

import React, { use } from 'react';

import { useRouter } from 'next/navigation';

import { Card, CardContent, Typography } from '@mui/material';

import { History as HistoryIcon, User } from 'lucide-react';
import { toast } from 'react-toastify';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetUser from '@/services/user/useGetUser';
import useUpdateUser from '@/services/user/useUpdateUser';

import UserForm from '../_components/UserForm';
import UserTransactionHistory from '../_components/UserTransactionHistory';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const router = useRouter();
  const { uuid } = use(params);

  const { data: user, isLoading } = useGetUser(uuid);

  const { mutate, isPending } = useUpdateUser(uuid, {
    onSuccess() {
      toast('Data user berhasil diperbarui', { type: 'success' });
      router.push('/dashboard/user');
    },
  });

  const breadcrumbs = [
    {
      label: 'User',
      href: '/dashboard/user',
    },
    {
      label: user?.name || 'Detail User',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 pb-12">
        <DashboardTitle
          title={user?.name ? `Detail User: ${user.name}` : 'Detail User'}
          subTitle="Kelola informasi akun penyewa dan pantau riwayat transaksi sewa."
          breadcrumbs={breadcrumbs}
        />

        <div className="grid grid-cols-1 gap-6">
          <UserForm
            onSubmit={mutate}
            initialValues={
              user && {
                name: user.name,
                email: user.user.email,
                role_uuid: user.role.uuid,
                password: '',
                password_confirmation: '',
                phone_number: user.phone_number,
                status: user.status || 'aktif',
                version: user.version,
                user_information_uuid: user.user.uuid,
                user_information_version: user.user.version,
              }
            }
            isLoading={isPending || isLoading}
          />

          <Card variant="outlined" className="rounded-xl border-slate-200 shadow-xs">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <HistoryIcon className="text-primary-500" size={20} />
                <Typography variant="h6" className="font-semibold text-slate-800">
                  Riwayat Transaksi Sewa
                </Typography>
              </div>
              <Typography variant="body2" className="mb-4 text-slate-500">
                Daftar semua transaksi rental kendaraan atau barang yang pernah dilakukan oleh user
                ini.
              </Typography>

              <UserTransactionHistory userEmail={user?.user?.email} userName={user?.name} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Page;
