import { Button } from '@mui/material';

import dayjs from 'dayjs';
import { CalendarPlus, Trash2 } from 'lucide-react';
import {
  Control,
  FieldErrors,
  FieldValues,
  useFieldArray,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

import AutoComplete from '@/components/ui/form/AutoComplete';
import DatePicker from '@/components/ui/form/DatePicker';
import FormCard from '@/components/ui/form/FormCard';
import NumberInput from '@/components/ui/form/NumberInput';

import { getActiveDayByRepeatOn } from '../../../rooms-and-pricing/_utils';
import {
  defaultPackageTourPricingDateForm,
  PackageTourPricingFormType,
} from '../_utils/package-tour-pricing-schema';

interface Props {
  watch: UseFormWatch<PackageTourPricingFormType>;
  control: Control<PackageTourPricingFormType, any, FieldValues>;
  setValue: UseFormSetValue<PackageTourPricingFormType>;
  errors: FieldErrors<PackageTourPricingFormType>;
  isEdit?: boolean;
}

const PackageTourPricingDatesForm = ({ watch, control, setValue, errors, isEdit }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dates',
  });

  return (
    <FormCard
      title="Package Tour Dates Availability"
      subTitle="Manage available dates for the Package Tour"
      cardHeaderComponent={
        !isEdit && (
          <Button
            variant="outlined"
            color="black"
            size="small"
            className="h-fit"
            startIcon={<CalendarPlus size={'1rem'} />}
            onClick={() => append(defaultPackageTourPricingDateForm)}
          >
            Add Date
          </Button>
        )
      }
    >
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-4">
          <AutoComplete
            className="w-full"
            control={control}
            name={`dates.${index}.repeat_on`}
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
            name={`dates.${index}.date`}
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
                !getActiveDayByRepeatOn(watch(`dates.${index}.repeat_on`), dayjs(modifiers.day)) &&
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
            name={`dates.${index}.quantity`}
            label="Total Qty"
            className="w-1/2"
            size="small"
          />
          <Button
            variant="outlined"
            color="error"
            onClick={() => remove(index)}
            className="!size-[45px] items-center justify-center !p-2"
            disabled={fields.length === 1 || isEdit}
          >
            <Trash2 size={'1rem'} />
          </Button>
        </div>
      ))}
    </FormCard>
  );
};

export default PackageTourPricingDatesForm;
