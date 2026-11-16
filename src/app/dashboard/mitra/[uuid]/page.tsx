'use client';

import React, { use } from 'react';

import { useRouter } from 'next/navigation';

import { Card, CardContent, Typography } from '@mui/material';

import { Car } from 'lucide-react';
import { toast } from 'react-toastify';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetMitra from '@/services/mitra/useGetMitra';
import useUpdateMitra from '@/services/mitra/useUpdateMitra';

import MitraForm from '../_components/MitraForm';
import MitraUnitTable from '../_components/MitraUnitTable';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const router = useRouter();
  const { uuid } = use(params);

  const { data, isLoading } = useGetMitra(uuid);
  const { mutate, isPending } = useUpdateMitra(uuid, {
    onSuccess() {
      toast('Data mitra berhasil diperbarui', { type: 'success' });
      router.push('/dashboard/mitra');
    },
  });

  const mitraData = data?.data;

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 pb-12">
        <DashboardTitle
          title={mitraData?.name ? `Detail Mitra: ${mitraData.name}` : 'Detail Mitra'}
          subTitle="Kelola informasi kerja sama mitra dan unit rental yang terdaftar."
          breadcrumbs={[
            {
              label: 'Master Mitra',
              href: '/dashboard/mitra',
            },
            {
              label: mitraData?.name || 'Detail Mitra',
            },
          ]}
        />

        <div className="grid grid-cols-1 gap-6">
          <MitraForm
            onSubmit={(d, options) => mutate(d, options)}
            initialValues={
              mitraData
                ? {
                    name: mitraData.name,
                    email: mitraData.email,
                    phone_number: mitraData.phone_number,
                    address: mitraData.address || '',
                    city: mitraData.city || '',
                    cooperation_status: mitraData.cooperation_status || 'aktif',
                    bank_name: mitraData.bank_name || 'BCA',
                    bank_account_number: mitraData.bank_account_number || '',
                    bank_account_holder: mitraData.bank_account_holder || '',
                    location: mitraData.location || '',
                    company: mitraData.company || '',
                    version: mitraData.version,
                  }
                : undefined
            }
            isLoading={isPending || isLoading}
          />

          <Card variant="outlined" className="rounded-xl border-slate-200 shadow-xs">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="text-primary-500" size={20} />
                  <Typography variant="h6" className="font-semibold text-slate-800">
                    Daftar Unit Milik Mitra
                  </Typography>
                </div>
                <span className="bg-primary-50 text-primary-700 rounded-full px-3 py-1 text-xs font-semibold">
                  Total: {mitraData?.units?.length || 0} Unit
                </span>
              </div>
              <Typography variant="body2" className="mb-4 text-slate-500">
                Unit kendaraan atau barang yang terdaftar atas nama mitra ini di platform Rentaku.
              </Typography>

              <MitraUnitTable units={mitraData?.units} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Page;
