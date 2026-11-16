'use client';

import React, { useEffect } from 'react';

import { Button } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import FormCard from '@/components/ui/form/FormCard';
import TextInput from '@/components/ui/form/TextInput';

import { defaultRoleForm, roleFormSchema, RoleFormType } from '../_utils/role-schema';

interface Props {
  initialValues?: RoleFormType;
  onSubmit: UseMutateFunction<any, unknown, RoleFormType, unknown>;
  isLoading?: boolean;
}

const RoleForm = ({ onSubmit, initialValues, isLoading }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitted },
  } = useForm<RoleFormType>({
    defaultValues: initialValues || defaultRoleForm,
    resolver: zodResolver(roleFormSchema),
  });

  useEffect(() => {
    if (!isSubmitted) {
      reset(initialValues || defaultRoleForm);
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
              setError(key as keyof RoleFormType, {
                type: 'pattern',
                message: message[key],
              });
            });
          },
        }),
      )}
    >
      <FormCard title="Role Information" subTitle="Role name, code, description, etc...">
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
        {initialValues ? 'Update Role' : 'Create Role'}
      </Button>
    </form>
  );
};

export default RoleForm;
