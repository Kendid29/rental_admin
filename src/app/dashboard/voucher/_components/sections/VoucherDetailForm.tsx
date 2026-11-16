import { Button } from '@mui/material';

import { Control, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';

import AutoComplete from '@/components/ui/form/AutoComplete';
import DatePicker from '@/components/ui/form/DatePicker';
import FileDropzone from '@/components/ui/form/FileDropzone';
import FormCard from '@/components/ui/form/FormCard';
import SwitchCard from '@/components/ui/form/SwitchCard';
import TextInput from '@/components/ui/form/TextInput';
import { useTranslation } from '@/lib/hooks/useTranslation';
import useGetRoomTypes from '@/services/room-type/useGetRoomTypes';
import useGetVillaClasses from '@/services/villa-class/useGetVillaClasses';
import useGetVoucherCategories from '@/services/voucher-category/useGetVoucherCategories';
import useGetPackageTours from '@/services/package-tour/useGetPackageTours';

import { VoucherFormType } from '../../_utils/voucher-schema';

interface Props {
  watch: UseFormWatch<VoucherFormType>;
  control: Control<VoucherFormType>;
  setValue: UseFormSetValue<VoucherFormType>;
  errors: FieldErrors<VoucherFormType>;
}

const VoucherDetailForm = ({ control, setValue }: Props) => {
  const { tCommon } = useTranslation();

  const generateCode = () => {
    // generate random code length 6
    const code = Math.random().toString(36).slice(2, 10);

    setValue('code', code.toUpperCase(), { shouldValidate: true });
  };

  const { data: voucherCategories, isLoading } = useGetVoucherCategories();
  const { data: rooms, isLoading: isLoadingRooms } = useGetRoomTypes();
  const { data: villaClasses, isLoading: isLoadingVillaClasses } = useGetVillaClasses();
  const { data: packageTours, isLoading: isLoadingPackageTours } = useGetPackageTours();

  return (
    <FormCard
      title="Voucher Information"
      subTitle="Voucher name, code, description, etc..."
      className="grid grid-cols-2"
    >
      <div className="col-span-2">
        <FileDropzone
          control={control}
          name="photo_uuid"
          label="Voucher Image"
          options={{
            accept: {
              'image/*': ['.png', '.jpg', '.jpeg'],
            },
          }}
        />
      </div>
      <TextInput control={control} name="name" label="Voucher Name" size="small" />
      <div className="flex items-start gap-2">
        <TextInput
          control={control}
          name="code"
          label="Voucher Code"
          size="small"
          fullWidth
          manipulate={(v) => v.toUpperCase()}
        />
        <Button
          variant="outlined"
          color="gray"
          className="mt-0.5 h-[43px] min-w-fit rounded-lg"
          onClick={generateCode}
        >
          {tCommon('Generate')}
        </Button>
      </div>
      <AutoComplete
        control={control}
        name="voucher_category_uuid"
        label="Voucher Category"
        size="small"
        loading={isLoading}
        options={voucherCategories?.data.map((v) => ({ label: v.name, value: v.uuid })) || []}
      />
      <DatePicker
        control={control}
        name="date_range"
        label="Voucher Date"
        mode="range"
        slotProps={{ textField: { size: 'small' } }}
        disabled={{
          before: new Date(),
        }}
      />
      <AutoComplete
        control={control}
        className="col-span-2"
        multiple
        name="rooms"
        label="Applicable Room Types"
        size="small"
        options={rooms?.data.map((v) => ({ label: v.name, value: v.uuid })) || []}
        loading={isLoadingRooms}
      />
      <AutoComplete
        control={control}
        className="col-span-2"
        multiple
        name="villa_class_uuids"
        label="Applicable Villa Types"
        size="small"
        options={villaClasses?.data.map((v) => ({ label: v.name, value: v.uuid })) || []}
        loading={isLoadingVillaClasses}
      />
      <AutoComplete
        control={control}
        className="col-span-2"
        multiple
        name="package_tour_uuids"
        label="Applicable Package Tours"
        size="small"
        options={packageTours?.data.map((v) => ({ label: v.name, value: v.uuid })) || []}
        loading={isLoadingPackageTours}
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
        description="Make this voucher available to customers"
        // slotProps={{ card: { className: 'col-span-2' } }}
      />
      <SwitchCard
        name="is_published_cms"
        control={control}
        label="CMS Published Status"
        description="Make this voucher available in CMS"
        // slotProps={{ card: { className: 'col-span-2' } }}
      />
    </FormCard>
  );
};

export default VoucherDetailForm;
