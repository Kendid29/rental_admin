/* eslint-disable react/prop-types */
import { useState } from 'react';

import { Button, ButtonProps, FormHelperText } from '@mui/material';

import { ImageOff } from 'lucide-react';
import { Control, FieldValues, Path } from 'react-hook-form';

import ControllWrapper from '../form/FormControlWrapper';
import SafeDynamicIcon from '../SafeDynamicIcon';
import IconSelectorModal from './IconSelectorModal';

interface Props<T extends FieldValues> extends Omit<ButtonProps, 'variant'> {
  name: Path<T>;
  control?: Control<T, any, FieldValues>;
  label?: string;
  value?: string;
}

interface InputBaseProps extends Omit<ButtonProps, 'variant'> {
  onValueChange?: (value: string) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  value?: string;
}

const InputBase: React.FC<InputBaseProps> = ({
  onValueChange,
  error,
  helperText,
  label,
  value,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="relative">
        {label && (
          <div className="pointer-events-none absolute left-2 z-10 -translate-y-1/2 bg-white px-1 text-[0.7rem] text-black/40">
            {label}
          </div>
        )}
        <Button
          variant="outlined"
          color="black"
          className="relative flex size-[45px] items-center justify-center overflow-hidden rounded-[0.6rem] border! !border-black/25 p-0! hover:!border-[rgba(0,0,0,0.87)]"
          onClick={() => setOpen(true)}
          {...props}
        >
          {value ? (
            <SafeDynamicIcon name={value} size={'1rem'} />
          ) : (
            <ImageOff size={'1rem'} className="text-zinc-400/70" />
          )}
        </Button>
        {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
      </div>

      <IconSelectorModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(_value) => onValueChange?.(_value)}
        value={value}
      />
    </>
  );
};

const IconSelector = <T extends FieldValues>({ name, control, ...props }: Props<T>) => {
  return control ? (
    <ControllWrapper<T>
      name={name as Path<T>}
      control={control}
      render={({ onChange, error, helperText, ref, value: _value, disabled, ...field }) => (
        <InputBase
          onValueChange={(value) => onChange({ target: { value } })}
          error={error}
          helperText={helperText}
          ref={ref}
          value={_value}
          disabled={disabled}
          {...field}
          {...props}
        />
      )}
    />
  ) : (
    <InputBase />
  );
};

export default IconSelector;
/* eslint-enable react/prop-types */
