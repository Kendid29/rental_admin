import { Button, InputAdornment } from '@mui/material';

import { CirclePlus, Trash2 } from 'lucide-react';
import { Control, FieldErrors, FieldValues, useFieldArray } from 'react-hook-form';

import FormCard from '@/components/ui/form/FormCard';
import NumberInput from '@/components/ui/form/NumberInput';

import {
  defaultPackageTourPricingRangeForm,
  PackageTourPricingFormType,
} from '../_utils/package-tour-pricing-schema';

interface Props {
  control: Control<PackageTourPricingFormType, any, FieldValues>;
  errors: FieldErrors<PackageTourPricingFormType>;
  isEdit?: boolean;
}

const PackageTourPricingRangesForm = ({ control, errors, isEdit }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'price_ranges',
  });

  return (
    <FormCard
      title="Package Tour Price Ranges"
      subTitle="Manage pricing based on quantity of people"
      cardHeaderComponent={
        <Button
          variant="outlined"
          color="black"
          size="small"
          className="h-fit"
          startIcon={<CirclePlus size={'1rem'} />}
          onClick={() => append(defaultPackageTourPricingRangeForm)}
        >
          Add Range
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-4">
            <NumberInput
              control={control}
              name={`price_ranges.${index}.from_quantity`}
              label="From (Pax)"
              size="small"
              className="w-full"
            />
            <NumberInput
              control={control}
              name={`price_ranges.${index}.to_quantity`}
              label="To (Pax)"
              size="small"
              className="w-full"
            />
            <NumberInput
              control={control}
              name={`price_ranges.${index}.price`}
              label="Price"
              size="small"
              className="w-full"
              slotProps={{
                input: { startAdornment: <InputAdornment position="start">Rp</InputAdornment> },
              }}
            />
            <NumberInput
              control={control}
              name={`price_ranges.${index}.agent_price`}
              label="Agent Price"
              size="small"
              className="w-full"
              slotProps={{
                input: { startAdornment: <InputAdornment position="start">Rp</InputAdornment> },
              }}
            />
            <Button
              variant="outlined"
              color="error"
              onClick={() => remove(index)}
              className="mt-1 !size-[45px] min-w-[45px] items-center justify-center !p-2"
              disabled={fields.length === 1}
            >
              <Trash2 size={'1rem'} />
            </Button>
          </div>
        ))}
      </div>
    </FormCard>
  );
};

export default PackageTourPricingRangesForm;
