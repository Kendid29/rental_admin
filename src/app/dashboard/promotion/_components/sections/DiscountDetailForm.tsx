import { useEffect } from 'react';

import { InputAdornment, Typography } from '@mui/material';

import { DollarSign, Percent } from 'lucide-react';
import { Control, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';

import CheckboxCard from '@/components/ui/form/CheckboxCard';
import FormCard from '@/components/ui/form/FormCard';
import NumberInput from '@/components/ui/form/NumberInput';
import TextInput from '@/components/ui/form/TextInput';

import { PromotionFormType } from '../../_utils/promotion-schema';

interface Props {
  watch: UseFormWatch<PromotionFormType>;
  control: Control<PromotionFormType>;
  setValue: UseFormSetValue<PromotionFormType>;
  errors: FieldErrors<PromotionFormType>;
}

const DiscountDetailForm = ({ watch, control, setValue, errors }: Props) => {
  const promoType = watch('promo_type');

  useEffect(() => {
    if (promoType === 'nominal') {
      setValue('discount_percentage', 0, { shouldValidate: true });
      setValue('maximum_discount', 0, { shouldValidate: true });
    }

    if (promoType === 'percentage') {
      setValue('discount_nominal', 0, { shouldValidate: true });
    }
  }, [promoType, setValue]);

  return (
    <FormCard
      title="Discount Information"
      subTitle="Configure discount information for this promotion"
      className="grid grid-cols-2"
    >
      <CheckboxCard
        name="promo_type"
        control={control}
        disableDeselect
        label={
          <div className="flex flex-col">
            <Typography variant="body1" className="flex items-center gap-1">
              <Percent size={'1rem'} />
              Percentage Discount
            </Typography>
            <Typography variant="body2" className="-mt-1">
              Discount as a percentage of the total price
            </Typography>
          </div>
        }
        slotProps={{ card: { className: 'w-full' } }}
        manipulate={(v) => (v ? 'percentage' : 'nominal')}
        isChecked={(v) => v === 'percentage'}
      />
      <CheckboxCard
        name="promo_type"
        disableDeselect
        control={control}
        label={
          <div className="flex flex-col">
            <Typography variant="body1" className="flex items-center gap-1">
              <DollarSign size={'1rem'} />
              Fixed Amount Discount
            </Typography>
            <Typography variant="body2" className="-mt-1">
              Discount as a fixed amount of the total price
            </Typography>
          </div>
        }
        slotProps={{ card: { className: 'w-full' } }}
        manipulate={(v) => (v ? 'nominal' : 'percentage')}
        isChecked={(v) => v === 'nominal'}
      />

      <NumberInput
        control={control}
        name="discount_percentage"
        label="Discount Percentage"
        size="small"
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
            readOnly: watch('promo_type') !== 'percentage',
          },
        }}
      />
      <NumberInput
        control={control}
        name="discount_nominal"
        label="Discount Nominal"
        size="small"
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
            readOnly: watch('promo_type') !== 'nominal',
          },
        }}
      />

      <NumberInput
        control={control}
        name="maximum_discount"
        label="Maximum Discount Cap (Optional)"
        size="small"
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
            readOnly: watch('promo_type') !== 'percentage',
          },
        }}
      />

      <TextInput
        control={control}
        name="terms_and_conditions"
        label="Terms and Conditions"
        className="col-span-2"
        multiline
        rows={3}
      />
    </FormCard>
  );
};

export default DiscountDetailForm;
