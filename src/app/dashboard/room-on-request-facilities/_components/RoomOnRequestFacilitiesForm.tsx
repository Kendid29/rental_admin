'use client';

import React, { useEffect } from 'react';

import { Button } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import FormCard from '@/components/ui/form/FormCard';
import TextInput from '@/components/ui/form/TextInput';
import IconSelector from '@/components/ui/IconSelector';

import {
  defaultRoomOnRequestFacilitiesForm,
  roomOnRequestFacilitiesFormSchema,
  RoomOnRequestFacilitiesFormType,
} from '../_utils/room-on-request-facilities-schema';

interface Props {
  initialValues?: RoomOnRequestFacilitiesFormType;
  onSubmit: UseMutateFunction<any, unknown, RoomOnRequestFacilitiesFormType, unknown>;
  isLoading?: boolean;
}

const RoomOnRequestFacilitiesForm = ({ onSubmit, initialValues, isLoading }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitted },
  } = useForm<RoomOnRequestFacilitiesFormType>({
    defaultValues: initialValues || defaultRoomOnRequestFacilitiesForm,
    resolver: zodResolver(roomOnRequestFacilitiesFormSchema),
  });

  useEffect(() => {
    if (!isSubmitted) {
      reset(initialValues || defaultRoomOnRequestFacilitiesForm);
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
                setError(key as keyof RoomOnRequestFacilitiesFormType, {
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
        title="Room On Request Facility Information"
        subTitle="Room on request facility details..."
      >
        <div className="flex items-end gap-2">
          <IconSelector name="icon_title" control={control} label="Icon" />
          <TextInput control={control} name="name" label="Name" size="small" fullWidth />
        </div>
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
        {initialValues ? 'Update Room On Request Facility' : 'Create Room On Request Facility'}
      </Button>
    </form>
  );
};

export default RoomOnRequestFacilitiesForm;
