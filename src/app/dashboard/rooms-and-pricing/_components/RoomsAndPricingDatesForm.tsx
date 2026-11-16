import { Button } from '@mui/material';

import dayjs from 'dayjs';
import { CalendarPlus } from 'lucide-react';
import {
  Control,
  FieldErrors,
  FieldValues,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

import AutoComplete from '@/components/ui/form/AutoComplete';
import DatePicker from '@/components/ui/form/DatePicker';
import FormCard from '@/components/ui/form/FormCard';
import NumberInput from '@/components/ui/form/NumberInput';

import { getActiveDayByRepeatOn } from '../_utils';
import { defaultRoomDateForm, RoomsAndPricingFormType } from '../_utils/rooms-and-pricing-schema';

interface Props {
  watch: UseFormWatch<RoomsAndPricingFormType>;
  control: Control<RoomsAndPricingFormType, any, FieldValues>;
  setValue: UseFormSetValue<RoomsAndPricingFormType>;
  errors: FieldErrors<RoomsAndPricingFormType>;
  isEdit?: boolean;
}

const RoomsAndPricingDatesForm = ({ watch, control, setValue, errors, isEdit }: Props) => {
  const firstDate = watch('dates')?.[0];

  return (
    <FormCard
      title="Room and Pricing Dates Availability"
      subTitle="Manage available dates for the room and pricing"
      cardHeaderComponent={
        !isEdit && (
          <Button
            variant="outlined"
            color="black"
            size="small"
            className="h-fit"
            startIcon={<CalendarPlus size={'1rem'} />}
            onClick={() => setValue('dates', [defaultRoomDateForm])}
          >
            Reset Date
          </Button>
        )
      }
    >
      <div className="flex gap-4">
        <AutoComplete
          className="w-full"
          control={control}
          name="dates.0.repeat_on"
          label="Repeat On"
          size="small"
          options={[
            { label: 'All Days', value: 'all_days' },
            { label: 'Weekdays (Sun - Thu)', value: 'weekdays' },
            { label: 'Weekends (Fri - Sat)', value: 'weekends' },
          ]}
          readOnly={isEdit}
        />
        <DatePicker
          control={control}
          name="dates.0.date"
          label="Date"
          mode={isEdit ? 'single' : 'range'}
          readOnly={isEdit}
          slotProps={{
            textField: {
              size: 'small',
            },
          }}
          className="w-full"
          customModifiers={(modifiers) => {
            if (
              !getActiveDayByRepeatOn(firstDate?.repeat_on || '', dayjs(modifiers.day)) &&
              modifiers.range_middle
            ) {
              return {
                color: 'default',
                variant: 'contained',
              };
            }

            return {};
          }}
        />
        <NumberInput
          control={control}
          name="dates.0.quantity"
          label="Available Rooms"
          className="w-1/2"
          size="small"
        />
      </div>

      {isEdit && null}
    </FormCard>
  );
};

export default RoomsAndPricingDatesForm;
