'use client';

import React, { memo, useEffect } from 'react';

import Link from 'next/link';

import { Button } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import AutoComplete from '@/components/ui/form/AutoComplete';
import FormCard from '@/components/ui/form/FormCard';
import TextInput from '@/components/ui/form/TextInput';

import {
  defaultVehicleCategoryForm,
  VehicleCategoryFormType,
  vehicleCategorySchema,
} from '../_utils/vehicle-category-schema';

interface Props {
  initialValues?: VehicleCategoryFormType;
  onSubmit: UseMutateFunction<any, unknown, VehicleCategoryFormType, unknown>;
  isLoading?: boolean;
}

const typeOptions = [
  { label: 'Mobil', value: 'mobil' },
  { label: 'Motor', value: 'motor' },
  { label: 'Barang / Perlengkapan Outdoor', value: 'barang' },
];

const VehicleCategoryForm = ({ onSubmit, initialValues, isLoading }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitted },
  } = useForm<VehicleCategoryFormType>({
    defaultValues: initialValues || defaultVehicleCategoryForm,
    resolver: zodResolver(vehicleCategorySchema) as any,
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
                setError(key as keyof VehicleCategoryFormType, {
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
        title="Informasi Kategori"
        subTitle="Nama kategori, klasifikasi tipe utama kendaraan atau barang, dan deskripsi."
        className="grid grid-cols-2 gap-4"
      >
        <TextInput
          control={control}
          name="name"
          label="Nama Kategori"
          placeholder="Contoh: MPV / Mobil Keluarga"
          size="small"
          className="col-span-2 sm:col-span-1"
        />

        <AutoComplete
          control={control}
          name="type"
          renderInputProps={{ label: 'Tipe Utama' }}
          options={typeOptions}
          className="col-span-2 sm:col-span-1"
        />

        <TextInput
          control={control}
          name="code"
          label="Kode Kategori (Opsional)"
          placeholder="Contoh: mobil_mpv"
          size="small"
          className="col-span-2 sm:col-span-1"
        />

        <TextInput
          control={control}
          name="icon"
          label="Icon / Simbol (Opsional)"
          placeholder="Contoh: car, bike, package"
          size="small"
          className="col-span-2 sm:col-span-1"
        />

        <TextInput
          control={control}
          name="description"
          label="Deskripsi Kategori"
          placeholder="Jelaskan karakteristik unit pada kategori ini..."
          size="small"
          multiline
          rows={3}
          className="col-span-2"
        />
      </FormCard>

      <div className="mt-6 flex items-center justify-end gap-3">
        <Button
          component={Link}
          href="/dashboard/vehicle-category"
          variant="outlined"
          color="inherit"
        >
          Batal
        </Button>
        <Button variant="contained" color="primary" type="submit" loading={isLoading}>
          {initialValues ? 'Simpan Perubahan' : 'Tambah Kategori'}
        </Button>
      </div>
    </form>
  );
};

export default memo(VehicleCategoryForm);
