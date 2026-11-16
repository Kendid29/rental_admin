import { HTMLAttributes } from 'react';

import { TimePicker } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Control, FieldValues, Path } from 'react-hook-form';

import ControllWrapper from './FormControlWrapper';

interface Props<T extends FieldValues> extends HTMLAttributes<HTMLDivElement> {
  startName: Path<T>;
  endName: Path<T>;
  control?: Control<T, any, FieldValues>;
}

dayjs.extend(customParseFormat);

const TimeRange = <T extends FieldValues>({ startName, endName, control, ...props }: Props<T>) => {
  return (
    <ControllWrapper
      control={control}
      name={startName}
      render={({ onChange, value, ...field }) => {
        return (
          <ControllWrapper
            control={control}
            name={endName}
            render={({ onChange: endOnChange, value: endValue, ...endField }) => {
              return (
                <div className="flex w-full gap-4" {...props}>
                  <TimePicker
                    className="w-full"
                    value={dayjs(value, 'HH:mm:ss')}
                    onChange={(e) => {
                      onChange(dayjs(e).format('HH:mm'));
                    }}
                    slotProps={{
                      textField: {
                        ...field,
                      },
                    }}
                    label="Start"
                    ampm={false}
                  />
                  <TimePicker
                    className="w-full"
                    value={dayjs(endValue, 'HH:mm:ss')}
                    onChange={(e) => {
                      endOnChange(dayjs(e).format('HH:mm'));
                    }}
                    slotProps={{
                      textField: {
                        ...endField,
                      },
                    }}
                    label="End"
                    ampm={false}
                  />
                </div>
              );
            }}
          />
        );
      }}
    />
  );
};

export default TimeRange;
