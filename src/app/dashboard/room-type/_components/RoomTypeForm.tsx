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
import useGetVillaClasses from '@/services/villa-class/useGetVillaClasses';

import { BATH_TYPE, BED_TYPE } from '../_utils';
import {
  defaultRoomTypeForm,
  roomTypeFormSchema,
  RoomTypeFormType,
} from '../_utils/room-type-schema';
import RoomTypeFacilitiesForm from './RoomTypeFacilitiesForm';
import RoomTypeOnRequestFacilitiesForm from './RoomTypeOnRequestFacilitiesForm';

interface Props {
  onSubmit: UseMutateFunction<any, unknown, RoomTypeFormType, unknown>;
  initialValues?: RoomTypeFormType;
  isPending?: boolean;
}

const RoomTypeForm = ({ onSubmit, initialValues, isPending }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { isSubmitted, errors },
  } = useForm<RoomTypeFormType>({
    defaultValues: initialValues || defaultRoomTypeForm,
    resolver: zodResolver(roomTypeFormSchema) as any,
  });

  useEffect(() => {
    if (!isSubmitted) {
      reset(initialValues || defaultRoomTypeForm, {
        keepTouched: false,
        keepDefaultValues: false,
      });
    }
  }, [isSubmitted, initialValues, reset]);

  const { data: villaClasses, isLoading: isLoadingVillaClasses } = useGetVillaClasses();

  return (
    <form
      className="form-container relative mt-8 flex max-w-7xl flex-col gap-8"
      onSubmit={handleSubmit((d) => {
        const combined: any[] = [];
        if (d.thumbnail_photo) {
          if (Array.isArray(d.thumbnail_photo)) combined.push(...d.thumbnail_photo);
          else combined.push(d.thumbnail_photo);
        }
        if (Array.isArray(d.gallery_photos)) {
          combined.push(...d.gallery_photos);
        } else if (d.gallery_photos) {
          combined.push(d.gallery_photos);
        }
        if (combined.length === 0 && Array.isArray(d.room_type_images)) {
          combined.push(...d.room_type_images);
        }
        d.room_type_images = combined;

        onSubmit(d as any, {
          onError(error) {
            const { message } = (error as any).response?.data || {};

            if (message && typeof message === 'object') {
              Object.keys(message).forEach((key) => {
                setError(key as keyof RoomTypeFormType, {
                  type: 'pattern',
                  message: message[key],
                });
              });
            }
          },
        });
      })}
    >
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left Column: Room Type Information */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
          <FormCard
            title="Room Type Information"
            subTitle="Room type details, bed configuration, etc..."
          >
            <TextInput control={control} name="name" label="Name" size="small" />
            <AutoComplete
              control={control}
              name="room_category_uuid"
              label="Villa Class"
              size="small"
              options={
                villaClasses?.data.map((villaClass) => ({
                  label: villaClass.name,
                  value: villaClass.uuid,
                })) || []
              }
              loading={isLoadingVillaClasses}
            />
            <TextInput control={control} name="code" label="Code" size="small" />
            <SwitchCard
              control={control}
              name="is_published_cms"
              label="CMS Published Status"
              description="Make this room type visible in CMS"
            />
          </FormCard>
        </div>

        {/* Right Column: Properties & Facilities */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-8">
          <FormCard
            title="Room Type properties"
            subTitle="Select the properties for the room type"
            className="grid grid-cols-12"
          >
            <AutoComplete
              control={control}
              name="bed_type"
              label="Bed Type"
              size="small"
              options={BED_TYPE}
              className="col-span-6"
            />
            <NumberInput
              control={control}
              name="total_bed"
              label="Total Bed"
              size="small"
              className="col-span-6"
            />
            <NumberInput
              control={control}
              name="occupancy"
              label="Maximum Occupancy"
              size="small"
              className="col-span-6"
            />
            <NumberInput
              control={control}
              name="room_size"
              label="Room Size"
              size="small"
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                },
              }}
              className="col-span-6"
            />
            <AutoComplete
              control={control}
              name="bath_type"
              label="Bath Type"
              size="small"
              options={BATH_TYPE}
              className="col-span-12"
            />
            <NumberInput
              control={control}
              name="actual_quantity"
              label="Actual Quantity"
              size="small"
              className="col-span-4"
            />
            <NumberInput
              control={control}
              name="system_use_quantity"
              label="System Use Quantity"
              size="small"
              className="col-span-4"
            />
            <NumberInput
              control={control}
              name="other_use_quantity"
              label="Other Use Quantity"
              size="small"
              className="col-span-4"
            />
            <TextInput
              control={control}
              name="description"
              label="Description"
              size="small"
              multiline
              rows={3}
              className="col-span-12"
            />
          </FormCard>

          <RoomTypeFacilitiesForm
            watch={watch}
            control={control}
            setValue={setValue}
            errors={errors}
            initialValues={initialValues}
            key={'facilities'}
          />

          <RoomTypeOnRequestFacilitiesForm
            watch={watch}
            control={control}
            setValue={setValue}
            errors={errors}
            initialValues={initialValues}
            key={'on-request-facilities'}
          />
        </div>

        {/* Full Width Bottom Column: Images */}
        <div className="col-span-12">
          <FormCard
            title="Room Type Images"
            subTitle="Upload thumbnail photo and additional gallery photos for this room type"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <FileDropzone
                  control={control}
                  name="thumbnail_photo"
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
                  name="gallery_photos"
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

      <div className="flex justify-end mt-4">
        <Button
          variant="contained"
          color="primary"
          type="submit"
          loading={isPending}
        >
          {initialValues ? 'Update Room Type' : 'Create Room Type'}
        </Button>
      </div>
    </form>
  );
};

export default RoomTypeForm;
