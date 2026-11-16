'use client';

import React, { memo, useEffect } from 'react';

import { Button } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import {
  defaultVoucherForm,
  voucherFormSchema,
  type VoucherFormType,
} from '../_utils/voucher-schema';
import DiscountDetailForm from './sections/DiscountDetailForm';
import ScheduleDetailForm from './sections/ScheduleDetailForm';
import VoucherDetailForm from './sections/VoucherDetailForm';

interface Props {
  initialValues?: VoucherFormType;
  onSubmit: UseMutateFunction<any, unknown, VoucherFormType, unknown>;
  isLoading?: boolean;
}

const VoucherForm = ({ initialValues, onSubmit, isLoading }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    formState: { isSubmitted, errors },
  } = useForm<VoucherFormType>({
    defaultValues: initialValues || defaultVoucherForm,
    resolver: zodResolver(voucherFormSchema) as any,
  });

  useEffect(() => {
    if (!isSubmitted) {
      reset(initialValues || defaultVoucherForm);
    }
  }, [isSubmitted, initialValues, reset]);

  return (
    <form
      className="form-container mt-8 min-w-3xl"
      onSubmit={handleSubmit((d) =>
        onSubmit(d, {
          onError(error) {
            const { message } = (error as any).response.data;

            Object.keys(message).forEach((key) => {
              setError(key as keyof VoucherFormType, {
                type: 'pattern',
                message: message[key],
              });
            });
          },
        }),
      )}
    >
      <VoucherDetailForm control={control} setValue={setValue} errors={errors} watch={watch} />
      <DiscountDetailForm control={control} setValue={setValue} errors={errors} watch={watch} />
      <ScheduleDetailForm control={control} setValue={setValue} errors={errors} watch={watch} />

      <Button
        variant="contained"
        color="primary"
        type="submit"
        className="ml-auto"
        loading={isLoading}
      >
        {initialValues ? 'Update' : 'Create'} Voucher
      </Button>
    </form>
  );
};

export default memo(VoucherForm);
