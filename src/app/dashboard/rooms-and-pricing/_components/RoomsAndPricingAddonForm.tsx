import { memo, useState } from 'react';

import { Button, IconButton, InputAdornment, Typography, Collapse } from '@mui/material';

import { CirclePlus, ChevronDown, ChevronUp, Plus, Trash2, DollarSign } from 'lucide-react';
import {
  Control,
  FieldErrors,
  FieldValues,
  useFieldArray,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

import AutoComplete from '@/components/ui/form/AutoComplete';
import FormCard from '@/components/ui/form/FormCard';
import NumberInput from '@/components/ui/form/NumberInput';
import useGetRoomAddons from '@/services/room-addon/useGetRoomAddons';

import { defaultRoomAddonForm, RoomsAndPricingFormType } from '../_utils/rooms-and-pricing-schema';

interface Props {
  watch: UseFormWatch<RoomsAndPricingFormType>;
  control: Control<RoomsAndPricingFormType, any, FieldValues>;
  setValue: UseFormSetValue<RoomsAndPricingFormType>;
  errors: FieldErrors<RoomsAndPricingFormType>;
}

const RoomsAndPricingAddonTierForm = ({ control, addonIndex }: { control: any; addonIndex: number }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `addons.${addonIndex}.price_tiers`,
  });

  return (
    <div className="mt-4 flex flex-col gap-4 rounded-lg border border-gray-100 bg-gray-50/30 p-4">
      <div className="flex items-center justify-between">
        <Typography variant="subtitle2" className="font-bold text-gray-700">
          Price Tiers (Quantity Ranges)
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<Plus size="1rem" />}
          onClick={() => append({ from_quantity: 1, to_quantity: 1, price: 0, agent_price: 0 })}
          className="bg-primary hover:bg-primary/90"
        >
          Add Range
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-3">
            <NumberInput
              control={control}
              name={`addons.${addonIndex}.price_tiers.${index}.from_quantity`}
              label="From Qty"
              size="small"
              className="w-28"
            />
            <div className="mb-2 text-gray-400">to</div>
            <NumberInput
              control={control}
              name={`addons.${addonIndex}.price_tiers.${index}.to_quantity`}
              label="To Qty"
              size="small"
              className="w-28"
            />
            <NumberInput
              control={control}
              name={`addons.${addonIndex}.price_tiers.${index}.price`}
              label="Price per Unit"
              size="small"
              className="w-full"
              slotProps={{
                input: { startAdornment: <InputAdornment position="start">Rp</InputAdornment> },
              }}
            />
            <NumberInput
              control={control}
              name={`addons.${addonIndex}.price_tiers.${index}.agent_price`}
              label="Agent Price"
              size="small"
              className="w-full"
              slotProps={{
                input: { startAdornment: <InputAdornment position="start">Rp</InputAdornment> },
              }}
            />
            <IconButton
              color="error"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
              className="mb-0.5 border border-red-100 bg-white hover:bg-red-50"
            >
              <Trash2 size="1.1rem" />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};

const RoomsAndPricingAddonForm = ({ watch, control, setValue, errors }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'addons',
  });

  const { data: addons, isLoading: isLoadingAddons } = useGetRoomAddons();
  const [expandedAddons, setExpandedAddons] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedAddons((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <FormCard
      title="Addons"
      subTitle="Manage addons for the room and pricing"
      cardHeaderComponent={
        <Button
          variant="outlined"
          color="black"
          size="small"
          startIcon={<CirclePlus size={'1rem'} />}
          className="h-fit"
          onClick={() => append(defaultRoomAddonForm)}
        >
          Add Addon
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        {fields.length === 0 && (
          <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-100 bg-gray-50/50 p-8">
            <Typography variant="body1" className="font-medium text-gray-500">
              No addons configured
            </Typography>
            <Typography variant="body2" className="text-gray-400">
              Addons are optional features that can be added to the room and pricing.
            </Typography>
          </div>
        )}
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="group relative flex flex-col rounded-xl border border-gray-200 p-4 transition-all hover:border-primary/30 hover:shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <AutoComplete
                  control={control}
                  name={`addons.${index}.addon_uuid`}
                  label="Select Addon"
                  fullWidth
                  options={
                    addons?.data.map((addon) => ({
                      label: addon.name,
                      value: addon.uuid,
                    })) || []
                  }
                  size="small"
                  loading={isLoadingAddons}
                />
              </div>
              
              <Button
                variant={expandedAddons[field.id] ? 'contained' : 'outlined'}
                size="medium"
                startIcon={<DollarSign size="1rem" />}
                endIcon={expandedAddons[field.id] ? <ChevronUp size="1rem" /> : <ChevronDown size="1rem" />}
                onClick={() => toggleExpand(field.id)}
                className={`h-[40px] px-6 transition-colors ${
                  expandedAddons[field.id] ? 'bg-primary' : 'border-primary text-primary hover:bg-primary/5'
                }`}
              >
                Set Price
              </Button>

              <IconButton
                color="error"
                onClick={() => remove(index)}
                className="size-[40px] border border-red-100 bg-red-50/50 hover:bg-red-100"
              >
                <Trash2 size={'1.1rem'} />
              </IconButton>
            </div>

            <Collapse in={expandedAddons[field.id]} timeout="auto" unmountOnExit>
              <RoomsAndPricingAddonTierForm control={control} addonIndex={index} />
            </Collapse>
          </div>
        ))}
      </div>
    </FormCard>
  );
};

export default memo(RoomsAndPricingAddonForm);
