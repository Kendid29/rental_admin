import { Button } from '@mui/material';

import { Control, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';

import AutoComplete from '@/components/ui/form/AutoComplete';
import FormCard from '@/components/ui/form/FormCard';
import SwitchCard from '@/components/ui/form/SwitchCard';
import TextInput from '@/components/ui/form/TextInput';
import useGetPromotionCategories from '@/services/promotion-category/useGetPromotionCategories';
import useGetRoomTypes from '@/services/room-type/useGetRoomTypes';
import useGetVillaClasses from '@/services/villa-class/useGetVillaClasses';
import useGetPackageTours from '@/services/package-tour/useGetPackageTours';

import { PromotionFormType } from '../../_utils/promotion-schema';

interface Props {
  watch: UseFormWatch<PromotionFormType>;
  control: Control<PromotionFormType>;
  setValue: UseFormSetValue<PromotionFormType>;
  errors: FieldErrors<PromotionFormType>;
}

const PromotionDetailForm = ({ watch, control, setValue, errors }: Props) => {
  const { data: roomTypes, isLoading: isLoadingRoomTypes } = useGetRoomTypes();
  const { data: villaClasses, isLoading: isLoadingVillaClasses } = useGetVillaClasses();
  const { data: promotionCategories, isLoading } = useGetPromotionCategories();
  const { data: packageTours, isLoading: isLoadingPackageTours } = useGetPackageTours();

  return (
    <FormCard
      title="Promotion Information"
      subTitle="Promotion name, code, description, etc..."
      className="grid grid-cols-2"
    >
      <TextInput control={control} name="name" label="Promotion Name" size="small" />
      <TextInput control={control} name="code" label="Promo Code (Optional)" size="small" placeholder="e.g. STAYNOW" />
      <AutoComplete
        control={control}
        name="promo_category_uuid"
        label="Promotion Category"
        size="small"
        loading={isLoading}
        options={promotionCategories?.data.map((v) => ({ label: v.name, value: v.uuid })) || []}
        className="col-span-2"
      />

      <AutoComplete
        control={control}
        name="room_type_uuids"
        label="Applicable Room Types"
        size="small"
        multiple
        options={roomTypes?.data.map((v) => ({ label: v.name, value: v.uuid })) || []}
        loading={isLoadingRoomTypes}
        className="col-span-2"
      />
      <AutoComplete
        control={control}
        name="villa_class_uuids"
        label="Applicable Villa Types"
        size="small"
        multiple
        options={villaClasses?.data.map((v) => ({ label: v.name, value: v.uuid })) || []}
        loading={isLoadingVillaClasses}
        className="col-span-2"
      />
      <AutoComplete
        control={control}
        name="package_tour_uuids"
        label="Applicable Package Tours"
        size="small"
        multiple
        options={packageTours?.data.map((v) => ({ label: v.name, value: v.uuid })) || []}
        loading={isLoadingPackageTours}
        className="col-span-2"
      />

      <TextInput
        className="col-span-2"
        control={control}
        name="description"
        label="Description"
        size="small"
        multiline
        rows={3}
      />

      <SwitchCard
        name="is_published"
        control={control}
        label="Published Status"
        description="Make this promotion available to customers"
        slotProps={{ card: { className: 'col-span-2' } }}
      />
      <SwitchCard
        name="is_published_cms"
        control={control}
        label="CMS Published Status"
        description="Make this promotion available in CMS"
        slotProps={{ card: { className: 'col-span-2' } }}
      />
    </FormCard>
  );
};

export default PromotionDetailForm;
