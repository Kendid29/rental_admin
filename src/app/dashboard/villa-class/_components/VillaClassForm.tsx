'use client';

import React, { useEffect } from 'react';

import { Button } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import FileDropzone from '@/components/ui/form/FileDropzone';
import FormCard from '@/components/ui/form/FormCard';
import NumberInput from '@/components/ui/form/NumberInput';
import SwitchCard from '@/components/ui/form/SwitchCard';
import TextInput from '@/components/ui/form/TextInput';

import {
  defaultVillaClassForm,
  villaClassFormSchema,
  VillaClassFormType,
} from '../_utils/villa-class-schema';

interface Props {
  initialValues?: VillaClassFormType;
  onSubmit: UseMutateFunction<any, unknown, VillaClassFormType, unknown>;
  isLoading?: boolean;
}

const VillaClassForm = ({ onSubmit, initialValues, isLoading }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitted },
  } = useForm<VillaClassFormType>({
    defaultValues: initialValues || defaultVillaClassForm,
    resolver: zodResolver(villaClassFormSchema),
  });

  useEffect(() => {
    if (!isSubmitted) {
      reset(initialValues || defaultVillaClassForm);
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
                setError(key as keyof VillaClassFormType, {
                  type: 'pattern',
                  message: message[key],
                });
              });
            }
          },
        }),
      )}
    >
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left Column: General Information */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-8">
          <FormCard
            title="Villa Information"
            subTitle="General details about the villa complex"
          >
            <TextInput control={control} name="name" label="Villa Name" size="small" />
            <TextInput control={control} name="code" label="Villa Code" size="small" />
            <TextInput
              control={control}
              name="description"
              label="Description"
              size="small"
              multiline
              rows={3}
            />
            <SwitchCard
              control={control}
              name="is_active"
              label="Active Status"
              description="Make this villa active and listable in the system"
            />
          </FormCard>
        </div>

        {/* Right Column: Location & Details */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-8">
          <FormCard
            title="Location & Details"
            subTitle="Address, coordinates, and rules for guests"
          >
            <NumberInput control={control} name="max_guest" label="Maximum Guests" size="small" />
            <div className="grid grid-cols-2 gap-4">
              <TextInput control={control} name="check_in_time" label="Check In Time" size="small" placeholder="14:00" />
              <TextInput control={control} name="check_out_time" label="Check Out Time" size="small" placeholder="12:00" />
            </div>
            <TextInput
              control={control}
              name="address"
              label="Address"
              size="small"
              multiline
              rows={2}
            />
            <div className="grid grid-cols-2 gap-4">
              <TextInput control={control} name="latitude" label="Latitude" size="small" />
              <TextInput control={control} name="longitude" label="Longitude" size="small" />
            </div>
          </FormCard>
        </div>

        {/* Full Width Bottom Column: Images */}
        <div className="col-span-12">
          <FormCard
            title="Villa Images"
            subTitle="Upload thumbnail photo and additional gallery photos for this villa"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <FileDropzone
                  control={control}
                  name="thumbnail_uuid"
                  label="Thumbnail Photo (Cover)"
                  options={{
                    multiple: false,
                    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
                  }}
                />
              </div>

              <div>
                <FileDropzone
                  control={control}
                  name="images"
                  label="Gallery Photos (Multiple Upload)"
                  options={{
                    multiple: true,
                    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
                  }}
                />
              </div>
            </div>
          </FormCard>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button
          variant="contained"
          color="primary"
          type="submit"
          loading={isLoading}
        >
          {initialValues ? 'Update Villa' : 'Create Villa'}
        </Button>
      </div>
    </form>
  );
};

export default VillaClassForm;
