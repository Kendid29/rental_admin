'use client';

import React, { memo, useEffect } from 'react';

import Link from 'next/link';

import { Button } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import AutoComplete from '@/components/ui/form/AutoComplete';
import FormCard from '@/components/ui/form/FormCard';
import TelInput from '@/components/ui/form/TelephoneInput';
import TextInput from '@/components/ui/form/TextInput';

import { defaultMitraForm, mitraFormSchema, MitraFormType } from '../_utils/mitra-schema';

interface Props {
  initialValues?: MitraFormType;
  onSubmit: UseMutateFunction<any, unknown, MitraFormType, unknown>;
  isLoading?: boolean;
}

const cooperationStatusOptions = [
  { label: 'Aktif', value: 'aktif' },
  { label: 'Tidak Aktif', value: 'tidak_aktif' },
  { label: 'Ditangguhkan', value: 'ditangguhkan' },
];

const bankOptions = [
  { label: 'BCA (Bank Central Asia)', value: 'BCA' },
  { label: 'Bank Mandiri', value: 'Mandiri' },
  { label: 'BNI (Bank Negara Indonesia)', value: 'BNI' },
  { label: 'BRI (Bank Rakyat Indonesia)', value: 'BRI' },
  { label: 'CIMB Niaga', value: 'CIMB' },
  { label: 'Permata Bank', value: 'Permata' },
  { label: 'BSI (Bank Syariah Indonesia)', value: 'BSI' },
];

const MitraForm = ({ onSubmit, initialValues, isLoading }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitted },
  } = useForm<MitraFormType>({
    defaultValues: initialValues || defaultMitraForm,
    resolver: zodResolver(mitraFormSchema) as any,
  });

  useEffect(() => {
    if (!isSubmitted && initialValues) {
      reset(initialValues);
    }
  }, [isSubmitted, initialValues, reset]);

  return (
    <form
      className="form-container"
      onSubmit={handleSubmit((d) =>
        onSubmit(d, {
          onError(error: any) {
            const { message } = error?.response?.data || {};

            if (message && typeof message === 'object') {
              Object.keys(message).forEach((key) => {
                setError(key as keyof MitraFormType, {
                  type: 'server',
                  message: message[key],
                });
              });
            }
          },
        }),
      )}
    >
      <FormCard
        title="Informasi Mitra Pemilik Unit"
        subTitle="Nama pemilik/pengelola, badan usaha, kontak, dan wilayah operasional."
        className="grid grid-cols-2 gap-4"
      >
        <TextInput
          control={control}
          name="name"
          label="Nama Mitra / Pengelola"
          placeholder="Contoh: Berkah Rental Mobil Bandung"
          size="small"
          className="col-span-2 sm:col-span-1"
        />

        <TextInput
          control={control}
          name="company"
          label="Nama Perusahaan / CV (Opsional)"
          placeholder="Contoh: PT Berkah Rental Nusantara"
          size="small"
          className="col-span-2 sm:col-span-1"
        />

        <TextInput
          control={control}
          name="email"
          label="Email Mitra"
          placeholder="kontak@mitra.com"
          size="small"
          className="col-span-2 sm:col-span-1"
        />

        <TelInput
          control={control}
          name="phone_number"
          label="Nomor Telepon / WhatsApp"
          size="small"
          className="col-span-2 sm:col-span-1"
        />

        <TextInput
          control={control}
          name="city"
          label="Kota / Wilayah"
          placeholder="Contoh: Bandung"
          size="small"
          className="col-span-2 sm:col-span-1"
        />

        <AutoComplete
          control={control}
          name="cooperation_status"
          renderInputProps={{ label: 'Status Kerja Sama' }}
          options={cooperationStatusOptions}
          className="col-span-2 sm:col-span-1"
        />

        <TextInput
          control={control}
          name="address"
          label="Alamat Lengkap"
          placeholder="Masukkan alamat lengkap kantor / garasi mitra"
          size="small"
          className="col-span-2"
        />
      </FormCard>

      <FormCard
        title="Rekening Bank untuk Reimburse"
        subTitle="Rekening pembayaran untuk mentransfer hasil transaksi sewa ke mitra."
        className="mt-6 grid grid-cols-2 gap-4"
      >
        <AutoComplete
          control={control}
          name="bank_name"
          renderInputProps={{ label: 'Nama Bank' }}
          options={bankOptions}
          className="col-span-2 sm:col-span-1"
        />

        <TextInput
          control={control}
          name="bank_account_number"
          label="Nomor Rekening"
          placeholder="Contoh: 1234567890"
          size="small"
          className="col-span-2 sm:col-span-1"
        />

        <TextInput
          control={control}
          name="bank_account_holder"
          label="Nama Pemilik Rekening"
          placeholder="Sesuai buku tabungan"
          size="small"
          className="col-span-2"
        />
      </FormCard>

      <div className="mt-6 flex items-center justify-end gap-3">
        <Button component={Link} href="/dashboard/mitra" variant="outlined" color="inherit">
          Batal
        </Button>
        <Button variant="contained" color="primary" type="submit" loading={isLoading}>
          {initialValues ? 'Simpan Perubahan' : 'Tambah Mitra'}
        </Button>
      </div>
    </form>
  );
};

export default memo(MitraForm);
