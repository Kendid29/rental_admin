'use client';

import React, { useEffect } from 'react';

import { Button } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import FileDropzone from '@/components/ui/form/FileDropzone';
import FormCard from '@/components/ui/form/FormCard';
import SwitchCard from '@/components/ui/form/SwitchCard';
import TextInput from '@/components/ui/form/TextInput';

import {
  defaultMeetingLayoutForm,
  meetingLayoutFormSchema,
  type MeetingLayoutFormType,
} from '../_utils/meeting-layout-schema';

interface Props {
  initialValues?: MeetingLayoutFormType;
  onSubmit: UseMutateFunction<any, unknown, MeetingLayoutFormType, unknown>;
  isLoading?: boolean;
}

const MeetingLayoutForm = ({ onSubmit, initialValues, isLoading }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitted },
  } = useForm<MeetingLayoutFormType>({
    defaultValues: initialValues || defaultMeetingLayoutForm,
    resolver: zodResolver(meetingLayoutFormSchema as any),
  });

  useEffect(() => {
    if (!isSubmitted) {
      reset(initialValues || defaultMeetingLayoutForm);
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
              setError(key as keyof MeetingLayoutFormType, {
                type: 'pattern',
                message: message[key],
              });
            });
          },
        }),
      )}
    >
      <FormCard
        title="Meeting Layout Information"
        subTitle="Meeting layout name, code and description"
      >
        <TextInput control={control} name="name" label="Category Name" size="small" />
        <TextInput control={control} name="code" label="Code" size="small" />
        <TextInput
          control={control}
          name="description"
          label="Description"
          size="small"
          multiline
          rows={4}
        />
        <SwitchCard
          control={control}
          name="is_published_cms"
          label="CMS Published Status"
          description="Make this room type visible in CMS"
        />
        <FileDropzone control={control} name="photo_uuid" label="Photo" />
      </FormCard>

      <Button
        variant="contained"
        color="primary"
        type="submit"
        className="ml-auto"
        loading={isLoading}
      >
        {initialValues ? 'Update Layout' : 'Create Layout'}
      </Button>
    </form>
  );
};

export default MeetingLayoutForm;
