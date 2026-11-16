import { useState } from 'react';

import { TimePicker as MuiTimePicker, TimePickerProps } from '@mui/x-date-pickers';

import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Clock } from 'lucide-react';
import { Control, FieldValues, Path } from 'react-hook-form';

import ControllWrapper from './FormControlWrapper';

interface Props<T extends FieldValues> extends TimePickerProps {
  name: Path<T>;
  control: Control<T, any, FieldValues>;
  useEpoch?: boolean;
}

dayjs.extend(utc);

const calculateTimeEpoch = (value: Dayjs | null) => {
  if (!value) return null;

  return value.hour() * 60 * 60 + value.minute() * 60 + value.second();
};

const TimePicker = <T extends FieldValues>({ control, name, useEpoch, ...props }: Props<T>) => {
  const [open, setOpen] = useState(false);

  return (
    <ControllWrapper
      name={name}
      control={control}
      render={({ onChange, value, ...field }) => (
        <MuiTimePicker
          // open={open}
          ampm={false}
          // onClose={() => setOpen(false)}
          {...props}
          slotProps={{
            textField: {
              ...field,
              ...props.slotProps?.textField,
            },
            ...props.slotProps,
          }}
          slots={{
            openPickerIcon: () => <Clock size={'1rem'} />,
            ...props.slots,
          }}
          onChange={(val) => {
            onChange(useEpoch ? calculateTimeEpoch(val) : val?.format('HH:mm'));
          }}
          value={useEpoch ? dayjs.unix(value).utc() : dayjs(value, 'HH:mm')}
        />
      )}
    />
  );
};

export default TimePicker;
