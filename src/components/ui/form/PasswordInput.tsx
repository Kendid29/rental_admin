import { useState } from 'react';

import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import type { TextFieldProps } from '@mui/material/TextField';

import { Eye, EyeOff } from 'lucide-react';
import type { Control, FieldValues, Path } from 'react-hook-form';

import TextInput from './TextInput';

interface Props<T extends FieldValues> extends Omit<TextFieldProps, 'outlined'> {
  name: Path<T>;
  control?: Control<T, any, FieldValues>;
  helperText?: string;
}

const PasswordInput = <T extends FieldValues>({ name, control, ...props }: Props<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextInput
      label="Password"
      type={showPassword ? 'text' : 'password'}
      placeholder="********"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={'1rem'} /> : <Eye size={'1rem'} />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      name={name as Path<T>}
      control={control}
      {...props}
    />
  );
};

export default PasswordInput;
