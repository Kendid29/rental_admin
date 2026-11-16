'use client';

import React, { useEffect } from 'react';

import { Button, InputAdornment, Typography } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from '@tanstack/react-query';
import { ArrowRightLeft, Calendar, CircleX, Eye, HandCoins } from 'lucide-react';
import { useForm } from 'react-hook-form';

import TextContent from '@/components/ui/dashboard/TextContent';
import AutoComplete from '@/components/ui/form/AutoComplete';
import FormCard from '@/components/ui/form/FormCard';
import NumberInput from '@/components/ui/form/NumberInput';
import SwitchCard from '@/components/ui/form/SwitchCard';
import TextInput from '@/components/ui/form/TextInput';
import formatToRp from '@/lib/utils/formatToRp';
import useGetPackageTours from '@/services/package-tour/useGetPackageTours';
import useGetVillaClasses from '@/services/villa-class/useGetVillaClasses';

import {
  defaultPackageTourPricingForm,
  PackageTourPricingFormSchema,
  PackageTourPricingFormType,
} from '../_utils/package-tour-pricing-schema';
import PackageTourPricingDatesForm from './PackageTourPricingDatesForm';
import PackageTourPricingRangesForm from './PackageTourPricingRangesForm';

interface Props {
  initialValues?: PackageTourPricingFormType;
  onSubmit: UseMutateFunction<any, unknown, PackageTourPricingFormType, unknown>;
  isLoading?: boolean;
  isEdit?: boolean;
}

const PackageTourPricingForm = ({ onSubmit, initialValues, isLoading, isEdit }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    watch,
    setValue,
    formState: { isSubmitted, errors },
  } = useForm<PackageTourPricingFormType>({
    defaultValues: initialValues || defaultPackageTourPricingForm,
    resolver: zodResolver(PackageTourPricingFormSchema) as any,
  });

  useEffect(() => {
    if (!isSubmitted) {
      reset(initialValues || defaultPackageTourPricingForm);
    }
  }, [isSubmitted, initialValues, reset]);

  const { data: PackageTours, isLoading: isLoadingPackageTours } = useGetPackageTours();
  const { data: VillaClasses, isLoading: isLoadingVillaClasses } = useGetVillaClasses();

  return (
    <form
      className="form-container max-w-8xl relative mt-8 flex w-full flex-row items-start gap-8"
      onSubmit={handleSubmit((d) =>
        onSubmit(d as any, {
          onError(error) {
            const { message } = (error as any).response.data;

            Object.keys(message).forEach((key) => {
              setError(key as keyof PackageTourPricingFormType, {
                type: 'pattern',
                message: message[key],
              });
            });
          },
        }),
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <FormCard
          title="Package Tour Pricing Information"
          subTitle="General information about the Package Tour pricing"
          className="grid grid-cols-2"
        >
          <AutoComplete
            className="col-span-2"
            control={control}
            name="package_tour_uuid"
            label="Package Tour"
            size="small"
            options={
              PackageTours?.data.map((PackageTour) => ({
                label: PackageTour.name,
                value: PackageTour.uuid,
              })) || []
            }
            readOnly={isEdit}
            loading={isLoadingPackageTours}
          />

          <AutoComplete
            control={control}
            name="villa_class_uuid"
            label="Villa Class"
            size="small"
            options={
              VillaClasses?.data.map((villa) => ({
                label: villa.name,
                value: villa.uuid,
              })) || []
            }
            loading={isLoadingVillaClasses}
          />

          <div className="flex gap-4">
            <NumberInput
              control={control}
              name="min_qty"
              label="Minimal Person"
              size="small"
              className="w-full"
            />
            <NumberInput
              control={control}
              name="quantity"
              label="Total Quantity"
              size="small"
              className="w-full"
            />
          </div>
          <TextInput
            className="col-span-2"
            control={control}
            name="description"
            label="Description"
            multiline
            rows={3}
            InputLabelProps={{ shrink: true }}
          />
        </FormCard>

        <PackageTourPricingRangesForm control={control} errors={errors} isEdit={isEdit} />

        {!isEdit && (
          <PackageTourPricingDatesForm
            watch={watch}
            control={control}
            setValue={setValue}
            errors={errors}
            isEdit={isEdit}
          />
        )}
      </div>

      <div className="sticky top-8 flex h-fit w-[300px] max-w-[300px] min-w-[300px] flex-shrink-0 flex-col gap-8 2xl:w-[500px] 2xl:max-w-[500px] 2xl:min-w-[500px]">
        <FormCard title="Package Tour Pricing Summary">
          <div className="flex flex-col gap-2">
            <TextContent
              direction="horizontal"
              label="Package Tour"
              className="justify-between truncate"
            >
              {PackageTours?.data.find(
                (PackageTour) => PackageTour.uuid === watch('package_tour_uuid'),
              )?.name || 'Not Selected'}
            </TextContent>
            <TextContent
              direction="horizontal"
              label="Villa Class"
              className="justify-between truncate"
            >
              {VillaClasses?.data.find((villa) => villa.uuid === watch('villa_class_uuid'))?.name ||
                'Not Selected'}
            </TextContent>
            <TextContent
              direction="horizontal"
              label="Min Person"
              className="justify-between truncate"
            >
              {watch('min_qty')} Pax
            </TextContent>
            <TextContent
              direction="horizontal"
              label="Total Quantity"
              className="justify-between truncate"
            >
              {watch('quantity')} Qty
            </TextContent>
            
            <div className="mt-4 border-t pt-4">
              <Typography variant="subtitle2" className="mb-2 font-semibold">
                Price Ranges:
              </Typography>
              {watch('price_ranges')?.map((range, index) => (
                <div key={index} className="flex justify-between text-sm text-zinc-600">
                  <span>{range.from_quantity} - {range.to_quantity} Pax</span>
                  <span className="font-medium text-black">{formatToRp(range.price)}</span>
                </div>
              ))}
            </div>
          </div>
        </FormCard>

        <div className="flex flex-col gap-4">
          <SwitchCard
            control={control}
            name="is_published"
            label={
              <span className="flex items-center gap-1">
                <Eye size={'1rem'} /> Published
              </span>
            }
            description="Make this Package Tour pricing visible and available to customers"
          />
          <SwitchCard
            control={control}
            name="is_refundable"
            label={
              <span className="flex items-center gap-1">
                <HandCoins size={'1rem'} /> Refundable
              </span>
            }
            description="Allow guests to refund their Package Tour pricing"
          />
          <SwitchCard
            control={control}
            name="is_transferable"
            label={
              <span className="flex items-center gap-1">
                <ArrowRightLeft size={'1rem'} /> Transferable
              </span>
            }
            description="Allow guests to transfer their Package Tour pricing"
          />
          <SwitchCard
            control={control}
            name="is_cancellable"
            label={
              <span className="flex items-center gap-1">
                <CircleX size={'1rem'} /> Cancellable
              </span>
            }
            description="Allow guests to cancel their Package Tour pricing"
          />
          <SwitchCard
            control={control}
            name="is_rescheduleable"
            label={
              <span className="flex items-center gap-1">
                <Calendar size={'1rem'} /> Rescheduleable
              </span>
            }
            description="Allow guests to reschedule their Package Tour pricing"
          />
        </div>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          className="ml-auto"
          loading={isLoading}
        >
          {initialValues ? 'Update Package Tour Pricing' : 'Create Package Tour Pricing'}
        </Button>
      </div>
    </form>
  );
};

export default PackageTourPricingForm;
