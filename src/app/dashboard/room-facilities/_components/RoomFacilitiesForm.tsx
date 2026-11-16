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
  defaultRoomFacilitiesForm,
  roomFacilitiesFormSchema,
  RoomFacilitiesFormType,
} from '../_utils/room-facilities-schema';

interface Props {
  initialValues?: RoomFacilitiesFormType;
  onSubmit: UseMutateFunction<any, unknown, RoomFacilitiesFormType, unknown>;
  isLoading?: boolean;
}

const RoomFacilitiesForm = ({ onSubmit, initialValues, isLoading }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitted },
  } = useForm<RoomFacilitiesFormType>({
    defaultValues: initialValues || defaultRoomFacilitiesForm,
    resolver: zodResolver(roomFacilitiesFormSchema),
  });

  useEffect(() => {
    if (!isSubmitted) {
      reset(initialValues || defaultRoomFacilitiesForm);
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
                setError(key as keyof RoomFacilitiesFormType, {
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
        title="Room Facility Information"
        subTitle="Room facility name, code, description, etc..."
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
        {initialValues ? 'Update Room Facility' : 'Create Room Facility'}
      </Button>
    </form>
  );
};

export default RoomFacilitiesForm;
