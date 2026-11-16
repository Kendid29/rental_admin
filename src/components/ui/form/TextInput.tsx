import React from 'react';

// import InputLabel from '@mui/material/InputLabel';
import TextField, { type TextFieldProps } from '@mui/material/TextField';

import type { Control, FieldValues, Path } from 'react-hook-form';

import { useTranslation } from '@/lib/hooks/useTranslation';
import { cn } from '@/lib/utils';

import ControllWrapper from './FormControlWrapper';

interface Props<T extends FieldValues> extends Omit<TextFieldProps, 'outlined'> {
  name?: Path<T>;
  control?: Control<T, any, FieldValues>;
  helperText?: string;
  manipulate?: (value: string) => string | number;
}

const TextInput = <T extends FieldValues>({
  placeholder,
  name,
  control,
  manipulate,
  className,
  helperText,
  ...props
}: Props<T>) => {
  const { tCommon } = useTranslation();
  const translatedPlaceholder = placeholder ? tCommon(placeholder) : placeholder;
  const translatedLabel =
    props.label && typeof props.label === 'string' ? tCommon(props.label) : props.label;

  return control ? (
    <ControllWrapper<T>
      name={name as Path<T>}
      control={control}
      render={({ onChange, ...field }) => (
        <TextField
          hiddenLabel
          className={cn(props.hidden && 'hidden', className)}
          placeholder={translatedPlaceholder}
          onChange={(e) =>
            onChange({
              ...e,
              target: { value: manipulate?.(e.target.value) ?? e.target.value },
            })
          }
          {...field}
          {...props}
          label={translatedLabel}
          helperText={field.error ? field.helperText : helperText}
        />
      )}
    />
  ) : (
    <TextField hiddenLabel placeholder={translatedPlaceholder} {...props} label={translatedLabel} />
  );
};

export default TextInput;
