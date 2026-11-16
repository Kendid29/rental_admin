import { FormControlLabel, FormControlLabelProps } from '@mui/material';
import MuiCheckbox, { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox';

import { Control, FieldValues, Path } from 'react-hook-form';

import { cn } from '@/lib/utils';

import ControllWrapper from './FormControlWrapper';

export interface CheckboxProps<T extends FieldValues> extends MuiCheckboxProps {
  name?: Path<T>;
  control?: Control<T, any, FieldValues>;
  label?: string;
  manipulate?: (value: boolean) => boolean | string | number;
  isChecked?: (value: boolean | string | number) => boolean;
  disableDeselect?: boolean;
  formControlLabelProps?: Omit<FormControlLabelProps, 'label' | 'control'>;
}

const Checkbox = <T extends FieldValues>({
  label,
  name,
  control,
  className,
  manipulate,
  isChecked,
  disableDeselect,
  formControlLabelProps,
  ...props
}: CheckboxProps<T>) => {
  return control ? (
    <ControllWrapper
      name={name as Path<T>}
      control={control}
      render={({ value, onChange, error, helperText, ...field }) => (
        <FormControlLabel
          {...formControlLabelProps}
          label={label}
          className={cn('-ml-2', formControlLabelProps?.className)}
          control={
            <MuiCheckbox
              className={cn(className)}
              checked={isChecked ? isChecked(value) : !!value}
              {...field}
              onChange={(e) => {
                if (disableDeselect && !e.target.checked) {
                  return;
                }

                onChange({
                  ...e,
                  target: { value: manipulate?.(e.target.checked) ?? e.target.checked },
                });
              }}
              {...props}
            />
          }
        />
      )}
    />
  ) : (
    <FormControlLabel
      {...formControlLabelProps}
      label={label}
      className={cn('-ml-2', formControlLabelProps?.className)}
      control={<MuiCheckbox className={cn('', className)} {...props} />}
    />
  );
};

export default Checkbox;
