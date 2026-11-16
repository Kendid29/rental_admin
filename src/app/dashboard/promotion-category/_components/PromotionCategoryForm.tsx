'use client';

import React, { useEffect } from 'react';

import { Button } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import FormCard from '@/components/ui/form/FormCard';
import TextInput from '@/components/ui/form/TextInput';

import {
  defaultPromotionCategoryForm,
  promotionCategoryFormSchema,
  type PromotionCategoryFormType,
} from '../_utils/promotion-category-schema';

interface Props {
  initialValues?: PromotionCategoryFormType;
  onSubmit: UseMutateFunction<any, unknown, PromotionCategoryFormType, unknown>;
  isLoading?: boolean;
}

const PromotionCategoryForm = ({ onSubmit, initialValues, isLoading }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitted },
  } = useForm<PromotionCategoryFormType>({
    defaultValues: initialValues || defaultPromotionCategoryForm,
    resolver: zodResolver(promotionCategoryFormSchema),
  });

  useEffect(() => {
    if (!isSubmitted) {
      reset(initialValues || defaultPromotionCategoryForm);
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
              setError(key as keyof PromotionCategoryFormType, {
                type: 'pattern',
                message: message[key],
              });
            });
          },
        }),
      )}
    >
      <FormCard
        title="Promotion Category Information"
        subTitle="Promotion category name, code and description"
        className="grid grid-cols-2"
      >
        <TextInput
          control={control}
          name="name"
          label="Category Name"
          size="small"
          className="col-span-2"
        />
        <TextInput control={control} name="code" label="Code" size="small" className="col-span-2" />
        <TextInput
          control={control}
          name="description"
          label="Description"
          size="small"
          className="col-span-2"
          multiline
          rows={4}
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

export default PromotionCategoryForm;
