'use client';

import React, { useEffect } from 'react';

import { Button } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import AutoComplete from '@/components/ui/form/AutoComplete';
import FormCard from '@/components/ui/form/FormCard';
import PasswordInput from '@/components/ui/form/PasswordInput';
import TelInput from '@/components/ui/form/TelephoneInput';
import TextInput from '@/components/ui/form/TextInput';
import useGetRoles from '@/services/role/useGetRoles';

import { defaultMemberForm, memberFormSchema, MemberFormType } from '../_utils/member-schema';

interface Props {
  initialValues?: MemberFormType;
  onSubmit: UseMutateFunction<any, unknown, MemberFormType, unknown>;
  isLoading?: boolean;
}

const MemberForm = ({ onSubmit, initialValues, isLoading }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitted },
  } = useForm({
    defaultValues: defaultMemberForm,
    resolver: zodResolver(memberFormSchema(!!initialValues)),
  });

  const { data: roles } = useGetRoles();

  useEffect(() => {
    if (!isSubmitted) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  return (
    <form
      className="form-container mt-8"
      onSubmit={handleSubmit((d) =>
        onSubmit({
          ...d,
          password: d.password || '',
          password_confirmation: d.password_confirmation || '',
        }),
      )}
    >
      <FormCard
        title="Member Information"
        subTitle="Member name, email, phone number, etc..."
        className="grid grid-cols-2"
      >
        <TextInput
          control={control}
          name="name"
          label="Member Name"
          size="small"
          className="col-span-2"
        />
        <AutoComplete
          control={control}
          name="role_uuid"
          renderInputProps={{ label: 'Role' }}
          options={
            roles?.data?.map((d) => ({
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
        {initialValues ? 'Update Member' : 'Create Member'}
      </Button>
    </form>
  );
};

export default MemberForm;
