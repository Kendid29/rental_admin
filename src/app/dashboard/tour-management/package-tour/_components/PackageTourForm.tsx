'use client';

import React, { useEffect } from 'react';

import { Button, InputAdornment } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import FileDropzone from '@/components/ui/form/FileDropzone';
import FormCard from '@/components/ui/form/FormCard';
import NumberInput from '@/components/ui/form/NumberInput';
import SwitchCard from '@/components/ui/form/SwitchCard';
import TextInput from '@/components/ui/form/TextInput';

import {
  defaultPackageTourForm,
  PackageTourFormSchema,
  PackageTourFormType,
} from '../_utils/package-tour-schema';

interface Props {
  initialValues?: PackageTourFormType;
  onSubmit: UseMutateFunction<any, unknown, PackageTourFormType, unknown>;
  isLoading?: boolean;
}

const PackageTourForm = ({ onSubmit, initialValues, isLoading }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitted },
  } = useForm<PackageTourFormType>({
    defaultValues: initialValues || defaultPackageTourForm,
    resolver: zodResolver(PackageTourFormSchema(!!initialValues)) as any, // Type workaround for image_uuid
  });

  useEffect(() => {
    if (!isSubmitted) {
      reset(initialValues || defaultPackageTourForm);
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
              setError(key as keyof PackageTourFormType, {
                type: 'pattern',
                message: message[key],
              });
            });
          },
        }),
      )}
    >
      <FormCard
        title="Package Tour Information"
        subTitle="Package Tour name, code, description, price, etc..."
        className="grid grid-cols-2"
      >
        <TextInput control={control} name="name" label="Name" size="small" />
        <TextInput control={control} name="code" label="Code" size="small" />

        <NumberInput
          className={initialValues ? 'col-span-1' : 'col-span-2'}
          control={control}
          name="quantity"
          label="Quantity"
          size="small"
        />

        {initialValues && (
          <NumberInput
            className="col-span-1"
            control={control}
            name="current_quantity"
            label="Current Quantity"
            size="small"
          />
        )}

        <TextInput
          className="col-span-2"
          control={control}
          name="description"
          label="Description"
          size="small"
          multiline
          rows={3}
        />

        <SwitchCard
          control={control}
          name="is_active"
          label="Active Status"
          description="Make this Package Tour visible and available to customers"
          slotProps={{ card: { className: 'col-span-2' } }}
        />

        <div className="col-span-2">
          <FileDropzone
            control={control}
            name="image_uuid"
            label="Image"
            options={{
              accept: {
                'image/*': ['.png', '.jpg', '.jpeg'],
              },
            }}
          />
        </div>
      </FormCard>

      <Button
        variant="contained"
        color="primary"
        type="submit"
        className="ml-auto"
        loading={isLoading}
      >
        {initialValues ? 'Update Package Tour' : 'Create Package Tour'}
      </Button>
    </form>
  );
};

export default PackageTourForm;

