import { memo, useState } from 'react';

import { Button, Divider, InputAdornment, InputLabel, Typography } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';

import AutoComplete from '@/components/ui/form/AutoComplete';
import Checkbox from '@/components/ui/form/Checkbox';
import DatePicker from '@/components/ui/form/DatePicker';
import FormCard from '@/components/ui/form/FormCard';
import NumberInput from '@/components/ui/form/NumberInput';
import SwitchCard from '@/components/ui/form/SwitchCard';
import useGetRoomTypes from '@/services/room-type/useGetRoomTypes';

import {
  defaultRoomsAndPricingBulkEditForm,
  roomsAndPricingBulkEditFormSchema,
  RoomsAndPricingBulkEditFormType,
} from '../_utils/rooms-and-pricing-bulk-edit-schema';
import RoomsAndPricingBulkEditTable from './RoomsAndPricingBulkEditTable';

interface Props {
  initialValues?: RoomsAndPricingBulkEditFormType;
  onSubmit: UseMutateFunction<any, unknown, RoomsAndPricingBulkEditFormType, unknown>;
  isLoading?: boolean;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const RoomsAndPricingBulkEditForm = ({ onSubmit, initialValues, isLoading }: Props) => {
  const { control, handleSubmit, watch, setValue } = useForm<RoomsAndPricingBulkEditFormType>({
    defaultValues: initialValues || defaultRoomsAndPricingBulkEditForm,
    resolver: zodResolver(roomsAndPricingBulkEditFormSchema),
  });

  const [open, setOpen] = useState(false);

  const isSelectedAllDaysArr = Object.values(watch('selected_days'));
  const isSelectedAllDays = isSelectedAllDaysArr.every((day) => day);

  const { data: roomTypes, isLoading: isLoadingRoomTypes } = useGetRoomTypes();

  return (
    <>
      <form className="form-container mt-8" onSubmit={handleSubmit((d) => onSubmit(d))}>
        <FormCard
          title="Rooms and Pricing Configuration"
          subTitle="Base price, selling price, etc..."
          className="grid grid-cols-2"
        >
          <NumberInput
            control={control}
            name="base_price"
            label="New Base Price"
            size="small"
            slotProps={{
              input: { startAdornment: <InputAdornment position="start">Rp</InputAdornment> },
            }}
          />
          <NumberInput
            control={control}
            name="selling_price"
            label="New Selling Price"
            size="small"
            slotProps={{
              input: { startAdornment: <InputAdornment position="start">Rp</InputAdornment> },
            }}
          />
          <NumberInput
            control={control}
            name="quantity"
            label="New Quantity"
            size="small"
            className="col-span-2"
          />

          <SwitchCard
            control={control}
            name="is_published"
            label="Is Published"
            description="Make this room and pricing visible and available to customers"
            slotProps={{
              card: {
                className: 'col-span-2',
              },
            }}
          />

          <Divider className="col-span-2 my-0" />

          <Typography variant="h6" className="col-span-2 -mb-4">
            Apply to :
          </Typography>
          <AutoComplete
            control={control}
            name="room_type_uuids"
            label="Room Types"
            size="small"
            className="col-span-2"
            multiple
            options={
              roomTypes?.data.map((roomType) => ({ label: roomType.name, value: roomType.uuid })) ||
              []
            }
            loading={isLoadingRoomTypes}
          />

          <div className="col-span-2 -mt-2">
            <div className="mb-2 flex items-center justify-between">
              <InputLabel className="h-fit">Selected Days</InputLabel>
              <Checkbox
                formControlLabelProps={{
                  className: 'flex flex-row-reverse -mr-2',
                }}
                name="selected_days"
                label="All Days"
                checked={isSelectedAllDays}
                onChange={(e) => {
                  if (e.target.checked) {
                    Object.keys(watch('selected_days')).forEach((day) => {
                      setValue(`selected_days.${day}`, true);
                    });
                  } else {
                    Object.keys(watch('selected_days')).forEach((day) => {
                      setValue(`selected_days.${day}`, false);
                    });
                  }
                }}
              />
            </div>
            <div className="grid grid-cols-4 flex-wrap">
              {DAYS.map((day) => (
                <Checkbox key={day} label={day} name={`selected_days.${day}`} control={control} />
              ))}
            </div>
          </div>

          <DatePicker
            control={control}
            name="date_range"
            label="Dates"
            className="col-span-2"
            slotProps={{
              textField: {
                size: 'small',
              },
            }}
            mode="range"
            customModifiers={(modifiers) => {
              if (!isSelectedAllDaysArr[dayjs(modifiers.day).day()] && modifiers.range_middle) {
                return {
                  color: 'default',
                  variant: 'contained',
                };
              }

              return {};
            }}
          />
        </FormCard>

        <div className="flex justify-between">
          <Button type="button" variant="outlined" color="primary" onClick={() => setOpen(true)}>
            See Changes
          </Button>
          <Button type="submit" variant="contained" color="primary" loading={isLoading}>
            Update Room and Pricing
          </Button>
        </div>
      </form>

      <RoomsAndPricingBulkEditTable data={watch()} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default memo(RoomsAndPricingBulkEditForm);
