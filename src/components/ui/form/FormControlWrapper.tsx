'use client';

import { Control, Controller, ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

import { getValueByPath } from '@/lib/utils';

export interface RenderProps extends ControllerRenderProps<FieldValues, string> {
  error: boolean;
  helperText: string | undefined;
}

interface Props<T extends FieldValues> {
  name: Path<T>;
  control?: Control<T, any, FieldValues>;
  render: ({
    error,
    helperText,
    name,
    onBlur,
    onChange,
    ref,
    value,
    disabled,
  }: RenderProps) => React.ReactElement;
}

const ControllWrapper = <T extends FieldValues>({ name, control, render }: Props<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, formState: { errors } }) => {
      const errorMessage = getValueByPath(errors, name);

      const helperText = Array.isArray(errorMessage)
        ? errorMessage.find((error) => !!error?.message)?.message
        : errorMessage?.message;

      return render({
        ...field,
        error: !!getValueByPath(errors, name),
        helperText,
      });
    }}
  />
);

export default ControllWrapper;
