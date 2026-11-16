'use client';

import React, { memo, useEffect } from 'react';

import { Button } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import FormCard from '@/components/ui/form/FormCard';
import TelInput from '@/components/ui/form/TelephoneInput';
import TextInput from '@/components/ui/form/TextInput';

import { agentFormSchema, AgentFormType, defaultAgentForm } from '../_utils/agent-schema';

interface Props {
  initialValues?: AgentFormType;
  onSubmit: UseMutateFunction<any, unknown, AgentFormType, unknown>;
  isLoading?: boolean;
}

const AgentForm = ({ onSubmit, initialValues, isLoading }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitted },
  } = useForm<AgentFormType>({
    defaultValues: initialValues || defaultAgentForm,
    resolver: zodResolver(agentFormSchema),
  });

  useEffect(() => {
    if (!isSubmitted) {
      reset(initialValues || defaultAgentForm);
    }
  }, [isSubmitted, initialValues, reset]);

  return (
    <form
      className="form-container mt-8"
      onSubmit={handleSubmit((d) =>
        onSubmit(d, {
          onError(error: any) {
            const { message } = error?.response?.data || {};

            if (message && typeof message === 'object') {
              Object.keys(message).forEach((key) => {
                setError(key as keyof AgentFormType, {
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
        title="Agent Information"
        subTitle="Agent name, email, phone number, etc..."
        className="grid grid-cols-2"
      >
        <TextInput
          control={control}
          name="name"
          label="Agent Name"
          size="small"
          className="col-span-2"
        />
        <TextInput
          control={control}
          name="company"
          label="Company"
          size="small"
          className="col-span-2"
        />
        <TextInput control={control} name="email" label="Email" size="small" />
        <TelInput control={control} name="phone_number" label="Phone Number" size="small" />
        <TextInput
          control={control}
          name="location"
          label="Location"
          size="small"
          className="col-span-2"
        />
      </FormCard>

      <Button
        variant="contained"
        color="primary"
        type="submit"
        className="ml-auto"
        loading={isLoading}
      >
        {initialValues ? 'Update Agent' : 'Create Agent'}
      </Button>
    </form>
  );
};

export default memo(AgentForm);
