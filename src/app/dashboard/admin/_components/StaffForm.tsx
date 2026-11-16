'use client';

import React, { useEffect, useMemo } from 'react';

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

import { defaultStaffForm, staffFormSchema, StaffFormType } from '../_utils/staff-schema';

interface Props {
  initialValues?: StaffFormType;
  onSubmit: UseMutateFunction<any, unknown, StaffFormType, unknown>;
  isLoading?: boolean;
}

const StaffForm = ({ onSubmit, initialValues, isLoading }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitted },
  } = useForm({
    defaultValues: defaultStaffForm,
    resolver: zodResolver(staffFormSchema(!!initialValues)),
  });

  const { data: roles } = useGetRoles();

  useEffect(() => {
    if (!isSubmitted) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const filteredRoles = useMemo(() => {
    return roles?.data?.filter((d: any) => d.code !== 'member') || [];
  }, [roles]);

  return (
    <form
      className="form-container mt-8"
      onSubmit={handleSubmit((d) =>
        onSubmit(d as any, {
          onError(error) {
            const { message } = (error as any).response.data;

            Object.keys(message).forEach((key) => {
              return setError(key as any, {
                type: 'pattern',
                message: message[key],
              });
            });
          },
        }),
      )}
    >
      <FormCard
        title="Staff Information"
        subTitle="Staff name, email, phone number, etc..."
        className="grid grid-cols-2"
      >
        <TextInput
          control={control}
          name="name"
          label="Staff Name"
          size="small"
          className="col-span-2"
        />
        <AutoComplete
          control={control}
          name="role_uuid"
          renderInputProps={{ label: 'Role' }}
          options={
            filteredRoles?.map((d: any) => ({
              label: d.name,
              value: d.uuid,
            })) || []
          }
          className="col-span-2"
        />
        <TextInput control={control} name="email" label="Email" size="small" />
        <TelInput control={control} name="phone_number" label="Phone Number" size="small" />
        <PasswordInput control={control} name="password" label="Password" size="small" />
        <PasswordInput
          control={control}
          name="password_confirmation"
          label="Password Confirmation"
          size="small"
        />
      </FormCard>

      <Button
        variant="contained"
        color="primary"
        type="submit"
        className="ml-auto"
        loading={isLoading}
      >
        {initialValues ? 'Update Staff' : 'Create Staff'}
      </Button>
    </form>
  );
};

export default StaffForm;
