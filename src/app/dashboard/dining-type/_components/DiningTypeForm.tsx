'use client';

import React, { useEffect } from 'react';

import { Button } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import FormCard from '@/components/ui/form/FormCard';
import TextInput from '@/components/ui/form/TextInput';

import {
  defaultDiningTypeForm,
  diningTypeFormSchema,
  DiningTypeFormType,
} from '../_utils/dining-type-schema';

interface Props {
  initialValues?: DiningTypeFormType;
  onSubmit: UseMutateFunction<any, unknown, DiningTypeFormType, unknown>;
  isLoading?: boolean;
}

const DiningTypeForm = ({ onSubmit, initialValues, isLoading }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitted },
  } = useForm<DiningTypeFormType>({
    defaultValues: initialValues || defaultDiningTypeForm,
    resolver: zodResolver(diningTypeFormSchema),
  });

  useEffect(() => {
    if (!isSubmitted) {
      reset(initialValues || defaultDiningTypeForm);
    }
  }, [isSubmitted, initialValues, reset]);

  return (
    <form className="form-container mt-8" onSubmit={handleSubmit((d) => onSubmit(d))}>
      <FormCard
        title="Dining Type Information"
        subTitle="Dining type name, code, description, etc..."
      >
        <TextInput control={control} name="name" label="Name" size="small" />
        <TextInput control={control} name="code" label="Code" size="small" />
        <TextInput
          control={control}
          name="description"
          label="Description"
          size="small"
          multiline
          rows={3}
        />
      </FormCard>

      <Button
        variant="contained"
        color="primary"
        type="submit"
        className="ml-auto"
        loading={isLoading}
      >
        {initialValues ? 'Update Dining Type' : 'Create Dining Type'}
      </Button>
    </form>
  );
};

export default DiningTypeForm;
