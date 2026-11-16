'use client';

import { memo, useState } from 'react';

import { Button, InputAdornment, InputLabel } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Calendar, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';

import TextContent from '@/components/ui/dashboard/TextContent';
import AutoComplete from '@/components/ui/form/AutoComplete';
import Checkbox from '@/components/ui/form/Checkbox';
import DatePicker from '@/components/ui/form/DatePicker';
import FormCard from '@/components/ui/form/FormCard';
import NumberInput from '@/components/ui/form/NumberInput';
import SwitchCard from '@/components/ui/form/SwitchCard';
import formatToRp from '@/lib/utils/formatToRp';

import useGetPackageTours from '@/services/package-tour/useGetPackageTours';

import {
  defaultPackageTourPricingBulkEditForm,
  packageTourPricingBulkEditFormSchema,
  PackageTourPricingBulkEditFormType,
} from '../_utils/package-tour-pricing-bulk-edit-schema';
import PackageTourPricingBulkEditTable from './PackageTourPricingBulkEditTable';

interface Props {
  initialValues?: PackageTourPricingBulkEditFormType;
  onSubmit: UseMutateFunction<any, unknown, PackageTourPricingBulkEditFormType, unknown>;
  isLoading?: boolean;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const PackageTourPricingBulkEditForm = ({ onSubmit, initialValues, isLoading }: Props) => {
  const { control, handleSubmit, watch, setValue } = useForm<PackageTourPricingBulkEditFormType>({
    defaultValues: initialValues || defaultPackageTourPricingBulkEditForm,
    resolver: zodResolver(packageTourPricingBulkEditFormSchema),
  });

  const [open, setOpen] = useState(false);

  const selectedDaysState = watch('selected_days') || {};
  const isSelectedAllDaysArr = Object.values(selectedDaysState);
  const isSelectedAllDays =
    isSelectedAllDaysArr.length > 0 && isSelectedAllDaysArr.every((day) => day);

  const { data: PackageTours, isLoading: isLoadingPackageTours } = useGetPackageTours();

  return (
    <>
      <form
        className="form-container max-w-8xl relative mt-8 flex w-full flex-row items-start gap-8"
        onSubmit={handleSubmit((d) => onSubmit(d))}
      >
        {/* Left Column */}
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <FormCard
            title="Package Tour Bulk Configuration"
            subTitle="Set pricing and availability details"
            className="grid grid-cols-2 gap-4"
          >
            <AutoComplete
              className="col-span-2"
              control={control}
              name="package_tour_uuid"
              label="Package Tour"
              size="small"
              options={
                PackageTours?.data.map((tour) => ({
                  label: tour.name,
                  value: tour.uuid,
                })) || []
              }
              loading={isLoadingPackageTours}
            />

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
              label="New Total Qty"
              size="small"
              className="col-span-2"
            />
          </FormCard>

          <FormCard
            title="Dates Availability"
            subTitle="Define when this configuration will apply"
            className="flex flex-col gap-4"
          >
            <DatePicker
              control={control}
              name="date_range"
              label="Dates"
              className="w-full"
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

            <div className="mt-2 w-full">
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
                    const days = [
                      'Sunday',
                      'Monday',
                      'Tuesday',
                      'Wednesday',
                      'Thursday',
                      'Friday',
                      'Saturday',
                    ];
                    if (e.target.checked) {
                      days.forEach((day) => {
                        setValue(`selected_days.${day}`, true);
                      });
                    } else {
                      days.forEach((day) => {
                        setValue(`selected_days.${day}`, false);
                      });
                    }
                  }}
                />
              </div>
              <div className="grid grid-cols-4 flex-wrap gap-2">
                {DAYS.map((day) => (
                  <Checkbox key={day} label={day} name={`selected_days.${day}`} control={control} />
                ))}
              </div>
            </div>
          </FormCard>
        </div>

        {/* Right Column Sticky Sidebar */}
        <div className="sticky top-8 flex h-fit w-[300px] max-w-[300px] min-w-[300px] flex-shrink-0 flex-col gap-8 2xl:w-[500px] 2xl:max-w-[500px] 2xl:min-w-[500px]">
          <FormCard title="Bulk Edit Summary">
            <div className="flex flex-col gap-2">
              <TextContent
                direction="horizontal"
                label="Selected Tour"
                className="justify-between truncate"
              >
                <span className="text-right font-medium">
                  {PackageTours?.data.find((tour) => tour.uuid === watch('package_tour_uuid'))
                    ?.name || 'Not Selected'}
                </span>
              </TextContent>
              <TextContent
                direction="horizontal"
                label="Base Price"
                className="justify-between truncate"
              >
                <span className="font-medium">{formatToRp(watch('base_price') || 0)}</span>
              </TextContent>
              <TextContent
                direction="horizontal"
                label="Selling Price"
                className="justify-between truncate"
              >
                <span className="font-medium">{formatToRp(watch('selling_price') || 0)}</span>
              </TextContent>
              <TextContent
                direction="horizontal"
                label="Total Qty"
                className="justify-between truncate"
              >
                <span className="font-medium">{watch('quantity') || 0} Slots</span>
              </TextContent>
            </div>
          </FormCard>

          {/* Switch Cards */}
          <div className="flex flex-col gap-4">
            <SwitchCard
              control={control}
              name="is_published"
              label={
                <span className="flex items-center gap-1">
                  <Eye size={'1rem'} /> Published
                </span>
              }
              description="Make these Package Tour pricings visible and available to customers"
            />
          </div>

          <div className="flex justify-between gap-4">
            <Button
              type="button"
              variant="outlined"
              color="primary"
              onClick={() => setOpen(true)}
              className="flex-1"
            >
              See Changes
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              loading={isLoading}
              className="flex-1"
            >
              Update Package Tour Pricing
            </Button>
          </div>
        </div>
      </form>

      <PackageTourPricingBulkEditTable data={watch()} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default memo(PackageTourPricingBulkEditForm);
