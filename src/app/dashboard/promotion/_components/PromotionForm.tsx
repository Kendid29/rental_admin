'use client';

import React, { useEffect } from 'react';

import { Button } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import {
  defaultPromotionForm,
  promotionFormSchema,
  type PromotionFormType,
} from '../_utils/promotion-schema';
import DiscountDetailForm from './sections/DiscountDetailForm';
import PromotionDetailForm from './sections/PromotionDetailForm';
import ScheduleDetailForm from './sections/ScheduleDetailForm';

interface Props {
  initialValues?: PromotionFormType;
  onSubmit: UseMutateFunction<any, unknown, PromotionFormType, unknown>;
  isLoading?: boolean;
}

const PromotionForm = ({ initialValues, onSubmit, isLoading }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    formState: { isSubmitted, errors },
  } = useForm<PromotionFormType>({
    defaultValues: initialValues || defaultPromotionForm,
    resolver: zodResolver(promotionFormSchema) as any,
  });

  useEffect(() => {
    if (!isSubmitted) {
      reset(initialValues || defaultPromotionForm);
    }
  }, [isSubmitted, initialValues, reset]);

  return (
    <form
      className="form-container mt-8 min-w-4xl"
      onSubmit={handleSubmit((d) =>
        onSubmit(d, {
          onError(error) {
            const { message } = (error as any).response.data;

            Object.keys(message).forEach((key) => {
              setError(key as keyof PromotionFormType, {
                type: 'pattern',
                message: message[key],
              });
            });
          },
        }),
      )}
    >
      <PromotionDetailForm control={control} setValue={setValue} errors={errors} watch={watch} />
      <DiscountDetailForm control={control} setValue={setValue} errors={errors} watch={watch} />
      <ScheduleDetailForm control={control} setValue={setValue} errors={errors} watch={watch} />

      <Button
        variant="contained"
        color="primary"
        type="submit"
        className="ml-auto"
        loading={isLoading}
      >
        {initialValues ? 'Update' : 'Create'} Promotion
      </Button>
    </form>
  );
};

export default PromotionForm;
