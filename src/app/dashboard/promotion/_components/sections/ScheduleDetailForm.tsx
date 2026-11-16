import { Divider, Typography } from '@mui/material';

import dayjs from 'dayjs';
import { Control, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';

import AutoComplete from '@/components/ui/form/AutoComplete';
import DatePicker from '@/components/ui/form/DatePicker';
import FormCard from '@/components/ui/form/FormCard';
import TimePicker from '@/components/ui/form/TimePicker';

import { PromotionFormType } from '../../_utils/promotion-schema';

interface Props {
  watch: UseFormWatch<PromotionFormType>;
  control: Control<PromotionFormType>;
  setValue: UseFormSetValue<PromotionFormType>;
  errors: FieldErrors<PromotionFormType>;
}

const DAYS = [
  { label: 'Sunday', value: 'sunday' },
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
];

const ScheduleDetailForm = ({ watch, control, setValue, errors }: Props) => {
  return (
    <FormCard
      title="Schedule Information"
      subTitle="Configure schedule information for this promotion"
      className="grid grid-cols-12"
    >
      <Typography variant="body1" className="col-span-12 -mb-4">
        Booking Period
      </Typography>
      <DatePicker
        control={control}
        name="booking_date_range"
        label="Booking Date Range"
        mode="range"
        slotProps={{ textField: { size: 'small' } }}
        className="col-span-12"
      />

      <AutoComplete
        control={control}
        name="booking_days"
        label="Booking Days"
        size="small"
        multiple
        options={DAYS}
        className="col-span-12"
      />

      <TimePicker
        control={control}
        name="active_start_time"
        label="Active Start Time"
        slotProps={{ textField: { size: 'small' } }}
        className="col-span-6"
      />
      <TimePicker
        control={control}
        name="active_finish_time"
        label="Active Finish Time"
        slotProps={{ textField: { size: 'small' } }}
        className="col-span-6"
      />

      <Divider className="col-span-12 -my-2" />

      <Typography variant="body1" className="col-span-12 -mb-4">
        Stay Period
      </Typography>

      <DatePicker
        control={control}
        name="stay_date_range"
        label="Stay Date Range"
        mode="range"
        slotProps={{ textField: { size: 'small' } }}
        className="col-span-12"
      />
    </FormCard>
  );
};

export default ScheduleDetailForm;
