'use client';

import React, { useEffect } from 'react';

import { Button } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import FormCard from '@/components/ui/form/FormCard';
import NumberInput from '@/components/ui/form/NumberInput';
import SwitchCard from '@/components/ui/form/SwitchCard';
import TextInput from '@/components/ui/form/TextInput';

import {
  defaultVoucherCategoryForm,
  voucherCategoryFormSchema,
  VoucherCategoryFormType,
} from '../_utils/voucher-category-schema';

interface Props {
  initialValues?: VoucherCategoryFormType;
  onSubmit: UseMutateFunction<any, unknown, VoucherCategoryFormType, unknown>;
  isLoading?: boolean;
}

const VoucherCategoryForm = ({ onSubmit, initialValues, isLoading }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitted },
  } = useForm({
    defaultValues: defaultVoucherCategoryForm,
    resolver: zodResolver(voucherCategoryFormSchema),
  });

  useEffect(() => {
    if (!isSubmitted) {
      reset(initialValues);
    }
  }, [isSubmitted, initialValues, reset]);

  return (
    <form
      className="form-container mt-8"
      onSubmit={handleSubmit((d) =>
        onSubmit(d as any, {
          onError(error) {
            const { message } = (error as any).response.data;

            Object.keys(message).forEach((key) => {
              setError(key as keyof VoucherCategoryFormType, {
                type: 'pattern',
                message: message[key],
              });
            });
          },
        }),
      )}
    >
      <FormCard
        title="Voucher Category Information"
        subTitle="Voucher category name, code and description"
        className="grid grid-cols-2"
      >
        <TextInput
          control={control}
          name="name"
          label="Category Name"
          size="small"
          className="col-span-2"
        />
        <TextInput control={control} name="code" label="Code" size="small" />
        <NumberInput control={control} name="queue" label="Queue" size="small" />
        <TextInput
          control={control}
          name="description"
          label="Description"
          size="small"
          className="col-span-2"
          multiline
          rows={4}
        />

        <SwitchCard
          control={control}
          name="is_published"
          label="Published Status"
          description="Make this voucher category visible and available to customers"
          slotProps={{ card: { className: 'col-span-2' } }}
        />
        <SwitchCard
          control={control}
          name="is_published_cms"
          label="CMS Published Status"
          description="Make this voucher category visible and available to customers in CMS"
          slotProps={{ card: { className: 'col-span-2' } }}
        />
      </FormCard>

      <Button
        variant="contained"
        color="primary"
        type="submit"
        className="ml-auto"
        loading={isLoading}
      >
        {initialValues ? 'Update Category' : 'Create Category'}
      </Button>
    </form>
  );
};

export default VoucherCategoryForm;
