'use client';

import React, { useEffect, useMemo } from 'react';

import Link from 'next/link';

import { Button } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import AutoComplete from '@/components/ui/form/AutoComplete';
import FormCard from '@/components/ui/form/FormCard';
import PasswordInput from '@/components/ui/form/PasswordInput';
import TelInput from '@/components/ui/form/TelephoneInput';
import TextInput from '@/components/ui/form/TextInput';
import useGetRoles from '@/services/permission/useGetRoles';

import { adminFormSchema, AdminFormType, defaultAdminForm } from '../_utils/admin-schema';

interface Props {
  initialValues?: AdminFormType;
  onSubmit: UseMutateFunction<any, unknown, AdminFormType, unknown>;
  isLoading?: boolean;
}

const statusOptions = [
  { label: 'Aktif', value: 'aktif' },
  { label: 'Tidak Aktif', value: 'tidak_aktif' },
];

const AdminForm = ({ onSubmit, initialValues, isLoading }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitted },
  } = useForm<AdminFormType>({
    defaultValues: defaultAdminForm,
    resolver: zodResolver(adminFormSchema(!!initialValues)) as any,
  });

  const { data: roles } = useGetRoles();

  useEffect(() => {
    if (!isSubmitted && initialValues) {
      reset(initialValues);
    }
  }, [initialValues, isSubmitted, reset]);

  const filteredRoles = useMemo(() => {
    return (
      roles?.data
        ?.filter((d: any) => d.code !== 'member')
        ?.map((d: any) => ({
          label: d.name,
          value: d.uuid,
        })) || []
    );
  }, [roles]);

  return (
    <form
      className="form-container mt-8"
      onSubmit={handleSubmit((d) =>
        onSubmit(d, {
          onError(error: any) {
            const { message } = error?.response?.data || {};

            if (message && typeof message === 'object') {
              Object.keys(message).forEach((key) => {
                setError(key as any, {
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
        title="Informasi Administrator"
        subTitle="Nama, role, email, nomor telepon, dan status akun admin."
        className="grid grid-cols-2 gap-4"
      >
        <TextInput
          control={control}
          name="name"
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap"
          size="small"
          className="col-span-2"
        />

        <AutoComplete
          control={control}
          name="role_uuid"
          renderInputProps={{ label: 'Peran / Role' }}
          options={filteredRoles}
          className="col-span-2 sm:col-span-1"
        />

        <AutoComplete
          control={control}
          name="status"
          renderInputProps={{ label: 'Status Akun' }}
          options={statusOptions}
          className="col-span-2 sm:col-span-1"
        />

        <TextInput
          control={control}
          name="email"
          label="Email"
          placeholder="admin@rentaku.id"
          size="small"
          className="col-span-2 sm:col-span-1"
        />

        <TelInput
          control={control}
          name="phone_number"
          label="Nomor Telepon"
          size="small"
          className="col-span-2 sm:col-span-1"
        />

        <PasswordInput
          control={control}
          name="password"
          label={initialValues ? 'Kata Sandi Baru (Kosongkan jika tidak diubah)' : 'Kata Sandi'}
          placeholder="Minimal 6 karakter"
          size="small"
          className="col-span-2 sm:col-span-1"
        />

        <PasswordInput
          control={control}
          name="password_confirmation"
          label="Konfirmasi Kata Sandi"
          placeholder="Ulangi kata sandi"
          size="small"
          className="col-span-2 sm:col-span-1"
        />
      </FormCard>

      <div className="flex items-center justify-end gap-3">
        <Button component={Link} href="/dashboard/admin" variant="outlined" color="inherit">
          Batal
        </Button>
        <Button variant="contained" color="primary" type="submit" loading={isLoading}>
          {initialValues ? 'Simpan Perubahan' : 'Tambah Admin'}
        </Button>
      </div>
    </form>
  );
};

export default AdminForm;
