import React from 'react';

import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import { Control, Controller, FieldErrors } from 'react-hook-form';

import FormCard from '@/components/ui/form/FormCard';
import NumberInput from '@/components/ui/form/NumberInput';

import { ManualBookingFormType } from '../_utils/manual-booking-schema';

interface Props {
  control: Control<ManualBookingFormType, any>;
  errors: FieldErrors<ManualBookingFormType>;
  checkInDate: Dayjs | null;
}

const ManualBookingPeriodForm = ({ control, errors, checkInDate }: Props) => {
  return (
    <FormCard title="Booking Period & Guests">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="check_in"
          control={control}
          render={({ field }) => (
            <DatePicker
              {...field}
              label="Check In"
              format="DD MMM YYYY"
              slotProps={{
                textField: {
                  size: 'small',
                  InputLabelProps: { shrink: true },
                  error: !!errors.check_in,
                  helperText: errors.check_in?.message as string,
                  fullWidth: true,
                },
              }}
            />
          )}
        />
        <Controller
          name="check_out"
          control={control}
          render={({ field }) => (
            <DatePicker
              {...field}
              label="Check Out"
              format="DD MMM YYYY"
              minDate={checkInDate || undefined}
              slotProps={{
                textField: {
                  size: 'small',
                  InputLabelProps: { shrink: true },
                  error: !!errors.check_out,
                  helperText: errors.check_out?.message as string,
                  fullWidth: true,
                },
              }}
            />
          )}
        />
        <NumberInput
          control={control}
          name="adult_count"
          label="Adults"
          size="small"
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <NumberInput
          control={control}
          name="child_count"
          label="Children"
          size="small"
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      </div>
    </FormCard>
  );
};

export default ManualBookingPeriodForm;
