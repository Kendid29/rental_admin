import { ChangeEvent, forwardRef } from 'react';

import type { TextFieldProps } from '@mui/material/TextField';

import type { Control, FieldValues, Path } from 'react-hook-form';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

import TextInput from './TextInput';

interface Props<T extends FieldValues> extends Omit<TextFieldProps, 'outlined'> {
  name: Path<T>;
  control?: Control<T, any, FieldValues>;
  thousandSeparator?: string;
  helperText?: string;
}

const NumberFormatCustom = forwardRef<NumericFormatProps, NumericFormatProps>((props, ref) => {
  const { onChange, thousandSeparator, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      allowLeadingZeros
      thousandSeparator={thousandSeparator ?? ','}
      onValueChange={(values) => {
        if (onChange) {
          onChange({
            target: {
              name: props.name || '',
              value: typeof values.floatValue === 'number' ? values.floatValue : '',
            },
          } as unknown as ChangeEvent<HTMLInputElement>);
        }
      }}
    />
  );
});

const NumberInput = <T extends FieldValues>({ name, control, slotProps, ...props }: Props<T>) => {
  return (
    <TextInput
      name={name as Path<T>}
      control={control}
      {...props}
      slotProps={{
        ...slotProps,
        input: { inputComponent: NumberFormatCustom as any, ...slotProps?.input },
      }}
    />
  );
};

export default NumberInput;
