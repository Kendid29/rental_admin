import { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { MuiTelInput, type MuiTelInputProps } from 'mui-tel-input';
import type { Control, FieldValues, Path } from 'react-hook-form';

import ControllWrapper from './FormControlWrapper';

interface Props<T extends FieldValues> extends Omit<MuiTelInputProps, 'ref'> {
  name: Path<T>;
  control: Control<T, any, FieldValues>;
}

const TelInput = <T extends FieldValues>({ placeholder, name, control, ...props }: Props<T>) => {
  const [visValue, setVisValue] = useState('');

  return (
    <ControllWrapper<T>
      name={name}
      control={control}
      render={({ onChange, value, ...field }) => {
        const handleChange = useCallback(
          (val: string) => {
            setVisValue(val);
            onChange({
              target: {
                name: name || '',
                value: val.replaceAll('+', '').replaceAll(' ', ''),
              },
            } as unknown as ChangeEvent<HTMLInputElement>);
          },
          [onChange, setVisValue],
        );

        useEffect(() => {
          if (!value) {
            setVisValue('');
          } else if (`${value}`.startsWith('0')) {
            setVisValue(`${value}`.replace(/^0/u, '+62'));
          } else if (!`${value}`.startsWith('+')) {
            setVisValue(`+${value}`);
          } else {
            setVisValue(`${value}`);
          }
        }, [value]);

        return (
          <MuiTelInput
            defaultCountry="ID"
            forceCallingCode
            MenuProps={{
              slotProps: {
                paper: {
                  variant: 'outlined',
                },
              },
            }}
            {...field}
            {...(props as Omit<MuiTelInputProps, 'forceCallingCode'>)}
            value={visValue}
            onChange={handleChange}
          />
        );
      }}
    />
  );
};

export default TelInput;
