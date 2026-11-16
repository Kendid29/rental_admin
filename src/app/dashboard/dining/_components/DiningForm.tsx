'use client';

import React, { useEffect } from 'react';

import { Button, Card, Typography } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { initial } from 'lodash';
import { useForm } from 'react-hook-form';

import AutoComplete from '@/components/ui/form/AutoComplete';
import FileDropzone from '@/components/ui/form/FileDropzone';
import FormCard from '@/components/ui/form/FormCard';
import NumberInput from '@/components/ui/form/NumberInput';
import SwitchCard from '@/components/ui/form/SwitchCard';
import TextInput from '@/components/ui/form/TextInput';
import TimePicker from '@/components/ui/form/TimePicker';
import useGetDiningTypes from '@/services/dining-type/useGetDiningTypes';

import { defaultDiningForm, diningFormSchema, DiningFormType } from '../_utils/dining-schema';

interface Props {
  initialValues?: DiningFormType;
  onSubmit: UseMutateFunction<any, unknown, DiningFormType, unknown>;
  isLoading?: boolean;
}

const DAYS = Array.from({ length: 7 }, (_, i) =>
  dayjs().startOf('week').add(i, 'day').format('dddd'),
);

const DiningForm = ({ onSubmit, initialValues, isLoading }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { isSubmitted },
  } = useForm({
    defaultValues: defaultDiningForm,
    resolver: zodResolver(diningFormSchema),
  });

  const { data: dishTypes, isLoading: isDishTypesLoading } = useGetDiningTypes();

  useEffect(() => {
    if (!isSubmitted) {
      reset(initialValues);
    }
  }, [initialValues, isSubmitted, reset]);

  return (
    <form
      className="form-container mt-8 min-w-4xl"
      onSubmit={handleSubmit((d) =>
        onSubmit(d, {
          onError(error) {
            const { message } = (error as any).response.data;

            Object.keys(message).forEach((key) => {
              setError(key as keyof DiningFormType, {
                type: 'pattern',
                message: message[key],
              });
            });
          },
        }),
      )}
    >
      <FormCard
        title="Dining Information"
        subTitle="Dining name, description, code, etc..."
        className="grid grid-cols-2"
      >
        <TextInput control={control} name="name" label="Dining Name" size="small" />
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
        title="Dining Properties"
        subTitle="Dish type, capacity, location, etc."
        className="grid grid-cols-2"
      >
        <AutoComplete
          control={control}
          name="dish_types"
          label="Dish Types"
          size="small"
          multiple
          options={dishTypes?.data || []}
          loading={isDishTypesLoading}
          limitTags={3}
          disableCloseOnSelect
        />
        <NumberInput control={control} name="capacity" label="Capacity" size="small" />
        <TextInput
          control={control}
          name="location"
          label="Location"
          size="small"
          className="col-span-2"
        />

        <Typography className="col-span-2 -mb-5" variant="body1">
          Operating Hours
        </Typography>

        {/* <AutoComplete
          control={control}
          name="operational_days"
          label="Days"
          size="small"
          multiple
          options={DAYS.map((day) => ({ label: day, value: day.toLowerCase() }))}
          limitTags={3}
          disableCloseOnSelect
        /> */}

        <TextInput control={control} name="operational_days" label="Days" size="small" />

        <div className="flex gap-6">
          <TimePicker
            control={control}
            name="start_hour"
            label="Open at"
            slotProps={{
              textField: { size: 'small' },
            }}
          />
          <TimePicker
            control={control}
            name="end_hour"
            label="Close at"
            slotProps={{
              textField: { size: 'small' },
            }}
          />
        </div>

        <SwitchCard
          control={control}
          name="is_published_cms"
          label="Published Status"
          description="Make this dining visible and available to customers"
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
        {initialValues ? 'Update Dining' : 'Create Dining'}
      </Button>
    </form>
  );
};

export default DiningForm;
