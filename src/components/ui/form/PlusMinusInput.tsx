import { useRef } from 'react';

import { Button, ButtonProps, TextFieldProps } from '@mui/material';

import { Minus, Plus } from 'lucide-react';
import { Control, FieldValues, Path } from 'react-hook-form';

import { cn } from '@/lib/utils';

import NumberInput from './NumberInput';

interface Props<T extends FieldValues> extends Omit<TextFieldProps, 'outlined'> {
  name: Path<T>;
  control?: Control<T, any, FieldValues>;
  thousandSeparator?: string;
  helperText?: string;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  buttonProps?: ButtonProps;
}

const PlusMinusInput = <T extends FieldValues>({
  name,
  control,
  containerProps,
  buttonProps,
  ...props
}: Props<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButton = (transform: number) => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    )?.set;

    if (nativeInputValueSetter && inputRef.current) {
      nativeInputValueSetter.call(inputRef.current, Number(inputRef.current.value) + transform);
      inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  return (
    <div {...containerProps} className={cn('flex h-fit gap-2', containerProps?.className)}>
      <Button
        variant="outlined"
        color="black"
        {...buttonProps}
        className={cn('h-[45px]', buttonProps?.className)}
        size={props.size}
        onClick={() => handleButton(-1)}
      >
        <Minus size={'1rem'} />
      </Button>
      <NumberInput
        name={name}
        control={control}
        {...props}
        slotProps={{
          htmlInput: {
            ref: inputRef,
            className: 'text-center',
          },
          ...props.slotProps,
        }}
      />
      <Button
        variant="outlined"
        color="black"
        {...buttonProps}
        className={cn('h-[45px]', buttonProps?.className)}
        size={props.size}
        onClick={() => handleButton(1)}
      >
        <Plus size={'1rem'} />
      </Button>
    </div>
  );
};

export default PlusMinusInput;
