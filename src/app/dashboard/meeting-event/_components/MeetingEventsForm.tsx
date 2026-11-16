'use client';

import React, { useEffect } from 'react';

import { Button, InputAdornment } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import AutoComplete from '@/components/ui/form/AutoComplete';
import FileDropzone from '@/components/ui/form/FileDropzone';
import FormCard from '@/components/ui/form/FormCard';
import NumberInput from '@/components/ui/form/NumberInput';
import SwitchCard from '@/components/ui/form/SwitchCard';
import TextInput from '@/components/ui/form/TextInput';
import useGetMeetingLayouts from '@/services/meeting-layout/useGetMeetingLayouts';
import useGetMeetingPackages from '@/services/meeting-package/useGetMeetingPackages';

import {
  defaultMeetingEventsForm,
  meetingEventsFormSchema,
  MeetingEventsFormType,
} from '../_utils/meeting-events-schema';

interface Props {
  initialValues?: MeetingEventsFormType;
  onSubmit: UseMutateFunction<any, unknown, MeetingEventsFormType, unknown>;
  isLoading?: boolean;
}

const MeetingEventsForm = ({ onSubmit, initialValues, isLoading }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitted },
  } = useForm({
    defaultValues: defaultMeetingEventsForm,
    resolver: zodResolver(meetingEventsFormSchema),
  });

  useEffect(() => {
    if (!isSubmitted) {
      reset(initialValues);
    }
  }, [initialValues, isSubmitted, reset]);

  const { data: meetingPackages, isLoading: isLoadingMeetingPackages } = useGetMeetingPackages();
  const { data: meetingLayouts, isLoading: isLoadingMeetingLayouts } = useGetMeetingLayouts();

  return (
    <form
      className="form-container mt-8"
      onSubmit={handleSubmit((d) =>
        onSubmit(d as any, {
          onError(error) {
            const { message } = (error as any).response.data;

            Object.keys(message).forEach((key) => {
              setError(key as keyof MeetingEventsFormType, {
                type: 'pattern',
                message: message[key],
              });
            });
          },
        }),
      )}
    >
      <FormCard
        title="Meeting Room Information"
        subTitle="Meeting room name, description, code, etc..."
        className="grid grid-cols-2"
      >
        <TextInput control={control} name="name" label="Meeting Room Name" size="small" />
        <TextInput control={control} name="code" label="Code" size="small" />
        <TextInput
          control={control}
          name="description"
          label="Description"
          size="small"
          className="col-span-2"
          multiline
          rows={4}
        />

        <div className="col-span-2">
          <FileDropzone
            control={control}
            name="images"
            label="Images / Thumbnails"
            options={{
              multiple: true,
              accept: {
                'image/*': ['.png', '.jpg', '.jpeg'],
              },
            }}
          />
        </div>
      </FormCard>

      <FormCard
        title="Meeting Room Properties"
        subTitle="Location, capacity, etc."
        className="grid grid-cols-2"
      >
        <NumberInput control={control} name="capacity" label="Capacity" size="small" />
        <NumberInput
          control={control}
          name="rate"
          label="Rate (per day)"
          size="small"
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
            },
          }}
        />

        <AutoComplete
          control={control}
          name="layouts"
          label="Meeting Room Layouts"
          size="small"
          className="col-span-2"
          multiple
          loading={isLoadingMeetingLayouts}
          options={
            meetingLayouts?.data
              ?.filter((v) => v.is_published_cms)
              .map((v) => ({ label: v.name, value: v.uuid })) || []
          }
        />
        <AutoComplete
          control={control}
          name="meeting_packages"
          label="Meeting Packages"
          size="small"
          className="col-span-2"
          multiple
          loading={isLoadingMeetingPackages}
          options={meetingPackages?.data.map((v) => ({ label: v.name, value: v.uuid })) || []}
        />
        <TextInput
          control={control}
          name="location"
          label="Location"
          size="small"
          className="col-span-2"
        />

        <SwitchCard
          control={control}
          name="is_published_cms"
          label="CMS Published Status"
          description="Make this promotion visible and available to customers in CMS"
          slotProps={{ card: { className: 'col-span-2' } }}
        />
      </FormCard>

      <Button
        variant="contained"
        color="primary"
        type="submit"
        className="ml-auto"
        loading={isLoading}
      >
        {initialValues ? 'Update Meeting Room' : 'Create Meeting Room'}
      </Button>
    </form>
  );
};

export default MeetingEventsForm;
