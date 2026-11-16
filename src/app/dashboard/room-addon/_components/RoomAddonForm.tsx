'use client';

import React, { useEffect } from 'react';

import { Button } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import FormCard from '@/components/ui/form/FormCard';
import TextInput from '@/components/ui/form/TextInput';

import {
  defaultRoomAddonForm,
  roomAddonFormSchema,
  RoomAddonFormType,
} from '../_utils/room-addon-schema';

interface Props {
  initialValues?: RoomAddonFormType;
  onSubmit: UseMutateFunction<any, unknown, RoomAddonFormType, unknown>;
  isLoading?: boolean;
}

const RoomAddonForm = ({ onSubmit, initialValues, isLoading }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitted },
  } = useForm<RoomAddonFormType>({
    defaultValues: initialValues || defaultRoomAddonForm,
    resolver: zodResolver(roomAddonFormSchema),
  });

  useEffect(() => {
    if (!isSubmitted) {
      reset(initialValues || defaultRoomAddonForm);
    }
  }, [isSubmitted, initialValues, reset]);

  return (
    <form
      className="form-container mt-8"
      onSubmit={handleSubmit((d) =>
        onSubmit(d as any, {
          onError(error) {
            const { message } = (error as any).response?.data || {};

            if (message && typeof message === 'object') {
              Object.keys(message).forEach((key) => {
                setError(key as keyof RoomAddonFormType, {
                  type: 'pattern',
                  message: message[key],
                });
              });
            }
          },
        }),
      )}
    >
      <FormCard
        title="Room Addon Information"
        subTitle="Room addon name, code, description, etc..."
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
        {initialValues ? 'Update Room Addon' : 'Create Room Addon'}
      </Button>
    </form>
  );
};

export default RoomAddonForm;
