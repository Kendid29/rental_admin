'use client';

import React, { memo, useEffect } from 'react';

import { Button, InputAdornment, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from '@tanstack/react-query';
import { Calendar, CircleX, Coffee, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import TextContent from '@/components/ui/dashboard/TextContent';
import AutoComplete from '@/components/ui/form/AutoComplete';
import FormCard from '@/components/ui/form/FormCard';
import NumberInput from '@/components/ui/form/NumberInput';
import SwitchCard from '@/components/ui/form/SwitchCard';
import formatToRp from '@/lib/utils/formatToRp';
import useGetVillaClasses from '@/services/villa-class/useGetVillaClasses';
import useGetRoomTypes from '@/services/room-type/useGetRoomTypes';

import {
  defaultRoomsAndPricingForm,
  roomsAndPricingFormSchema,
  RoomsAndPricingFormType,
} from '../_utils/rooms-and-pricing-schema';
import RoomsAndPricingAddonForm from './RoomsAndPricingAddonForm';
import RoomsAndPricingDatesForm from './RoomsAndPricingDatesForm';
import RoomsAndPricingRoomsForm from './RoomsAndPricingRoomsForm';

interface Props {
  initialValues?: RoomsAndPricingFormType;
  onSubmit: UseMutateFunction<any, unknown, RoomsAndPricingFormType, unknown>;
  isLoading?: boolean;
}

const RoomsAndPricingForm = ({ onSubmit, initialValues, isLoading }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { isSubmitted, errors },
  } = useForm<RoomsAndPricingFormType>({
    defaultValues: initialValues || defaultRoomsAndPricingForm,
    resolver: zodResolver(roomsAndPricingFormSchema),
  });

  const { data: villaClasses, isLoading: isLoadingVillaClasses } = useGetVillaClasses();
  const { data: roomTypes, isLoading: isLoadingRoomTypes } = useGetRoomTypes();

  const selectedVillaUuid = watch('villa_class_uuid');
  const selectedVilla = villaClasses?.data?.find(({ uuid }) => uuid === selectedVillaUuid);

  const selectedRoomTypeUuid = watch('room_type_uuid');
  const selectedRoomType = roomTypes?.data?.find(({ uuid }) => uuid === selectedRoomTypeUuid);

  const pricingType = watch('pricing_type');

  useEffect(() => {
    if (!isSubmitted) {
      reset(initialValues || defaultRoomsAndPricingForm);
    }
  }, [isSubmitted, initialValues, reset]);

  return (
    <form
      className="form-container max-w-8xl relative mt-8 flex w-full flex-row items-start"
      onSubmit={handleSubmit(
        (d) =>
          onSubmit(d as any, {
            onError(error) {
              const errorData = (error as any).response?.data;
              const message = errorData?.message;

              if (message && typeof message === 'object') {
                Object.keys(message).forEach((key) => {
                  setError(key as keyof RoomsAndPricingFormType, {
                    type: 'pattern',
                    message: message[key],
                  });
                });
              } else if (typeof message === 'string') {
                toast(message, { type: 'error' });
              }
            },
          }),
        (e) => console.log(e),
      )}
    >
      <div className="flex w-full flex-col gap-8">
        <FormCard
          title="Pricing Configuration Mode"
          subTitle="Choose to price an entire Villa (and its room types) or a single Room Type directly"
        >
          <ToggleButtonGroup
            value={pricingType}
            exclusive
            onChange={(_, val) => {
              if (val) {
                setValue('pricing_type', val);
              }
            }}
            fullWidth
            size="medium"
            color="primary"
          >
            <ToggleButton value="villa" className="font-semibold">
              Villa Pricing (Full complex + individual rooms)
            </ToggleButton>
            <ToggleButton value="room_type" className="font-semibold">
              Room Type Pricing (Single room type rate)
            </ToggleButton>
          </ToggleButtonGroup>
        </FormCard>

        <FormCard
          title={pricingType === 'villa' ? "Villa and Pricing Configuration" : "Room and Pricing Configuration"}
          subTitle={pricingType === 'villa' ? "Select a villa, then price each room and the full villa" : "Select a room type, then configure its prices"}
          className="grid grid-cols-2"
        >
          <div className={pricingType === 'villa' ? 'col-span-2' : 'hidden'}>
            <AutoComplete
              control={control}
              name="villa_class_uuid"
              label="Villa"
              options={
                villaClasses?.data.map((villa) => ({ label: villa.name, value: villa.uuid })) || []
              }
              loading={isLoadingVillaClasses}
              className="w-full"
            />
          </div>
          <div className={pricingType === 'room_type' ? 'col-span-2' : 'hidden'}>
            <AutoComplete
              control={control}
              name="room_type_uuid"
              label="Room Type"
              options={
                roomTypes?.data.map((room) => ({
                  label: `${room.name} (${room.villa?.name || room.room_category?.name || 'No Villa'})`,
                  value: room.uuid,
                })) || []
              }
              loading={isLoadingRoomTypes}
              className="w-full"
            />
          </div>

          <NumberInput
            control={control}
            name="base_price"
            label={pricingType === 'villa' ? "Full Villa Base Price" : "Base Price"}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                size: 'small',
              },
            }}
          />
          <NumberInput
            control={control}
            name="selling_price"
            label={pricingType === 'villa' ? "Full Villa Selling Price" : "Selling Price"}
            size="small"
            slotProps={{
              input: { startAdornment: <InputAdornment position="start">Rp</InputAdornment> },
            }}
          />
          <NumberInput
            control={control}
            name="agent_price"
            label={pricingType === 'villa' ? "Full Villa Agent Price" : "Agent Price"}
            size="small"
            slotProps={{
              input: { startAdornment: <InputAdornment position="start">Rp</InputAdornment> },
            }}
          />

          <NumberInput
            control={control}
            name="max_adult"
            label={pricingType === 'villa' ? "Full Villa Max Adult" : "Max Adult"}
            size="small"
          />
          <NumberInput
            control={control}
            name="max_child"
            label={pricingType === 'villa' ? "Full Villa Max Child" : "Max Child"}
            size="small"
          />
        </FormCard>

        {pricingType === 'villa' && (
          <RoomsAndPricingRoomsForm
            watch={watch}
            control={control}
            setValue={setValue}
            errors={errors}
            isEdit={!!initialValues}
          />
        )}

        <RoomsAndPricingDatesForm
          watch={watch}
          control={control}
          setValue={setValue}
          errors={errors}
          isEdit={!!initialValues}
        />

        <RoomsAndPricingAddonForm
          watch={watch}
          control={control}
          setValue={setValue}
          errors={errors}
        />
      </div>

      <div className="sticky top-8 flex h-fit min-w-[300px] flex-col gap-8 2xl:min-w-[500px]">
        <FormCard title="Room and Pricing Summary">
          <div className="-mt-3 flex flex-col gap-2">
            <TextContent
              direction="horizontal"
              label={pricingType === 'villa' ? "Villa" : "Room Type"}
              className="justify-between truncate"
            >
              {pricingType === 'villa'
                ? (selectedVilla?.name || 'Not Selected')
                : (selectedRoomType?.name || 'Not Selected')
              }
            </TextContent>
            <TextContent
              direction="horizontal"
              label="Base Price"
              className="justify-between truncate"
            >
              {formatToRp(watch('base_price'))}
            </TextContent>
            <TextContent
              direction="horizontal"
              label="Selling Price"
              className="justify-between truncate"
            >
              {formatToRp(watch('selling_price'))}
            </TextContent>
            {pricingType === 'villa' && (
              <TextContent
                direction="horizontal"
                label="Rooms"
                className="justify-between truncate"
              >
                {(watch('rooms') || []).length} room(s)
              </TextContent>
            )}
            <TextContent direction="horizontal" label="Occupancy" className="justify-between truncate">
              {watch('max_adult')} Adults, {watch('max_child')} Children
            </TextContent>
          </div>
        </FormCard>

        <div className="flex flex-col gap-4">
          <SwitchCard
            control={control}
            name="is_breakfast"
            label={
              <span className="flex items-center gap-1">
                <Coffee size={'1rem'} /> Include Breakfast
              </span>
            }
            description="Complimentary breakfast service"
          />
          <SwitchCard
            control={control}
            name="is_cancellable"
            label={
              <span className="flex items-center gap-1">
                <CircleX size={'1rem'} /> Cancellable
              </span>
            }
            description="Allow guests to cancel their booking"
          />
          <SwitchCard
            control={control}
            name="is_rescheduleable"
            label={
              <span className="flex items-center gap-1">
                <Calendar size={'1rem'} /> Rescheduleable
              </span>
            }
            description="Allow guests to reschedule their booking"
          />
          <SwitchCard
            control={control}
            name="is_published"
            label={
              <span className="flex items-center gap-1">
                <Eye size={'1rem'} /> Published
              </span>
            }
            description="Visible to customers"
          />

        </div>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          className="ml-auto"
          loading={isLoading}
        >
          {initialValues ? 'Update Room and Pricing' : 'Create Room and Pricing'}
        </Button>
      </div>
    </form>
  );
};

export default memo(RoomsAndPricingForm);
