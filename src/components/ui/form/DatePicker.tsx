import 'react-day-picker/style.css';

import React, { useCallback } from 'react';
import { useEffect, useRef, useState } from 'react';

import {
  Box,
  FormHelperText,
  IconButton,
  IconButtonProps,
  InputAdornment,
  Popover,
  PopoverProps,
  TextFieldProps,
} from '@mui/material';

import dayjs from 'dayjs';
import { CalendarIcon, ChevronDown, ChevronLeft } from 'lucide-react';
import { Chevron, DayPicker, DayPickerProps, getDefaultClassNames } from 'react-day-picker';
import { Control, FieldValues, Path } from 'react-hook-form';

import { cn } from '@/lib/utils';

import ControllWrapper from './FormControlWrapper';
import TextInput from './TextInput';

export type Modifiers = Record<string, any>;

export interface DateRangType {
  from: string;
  to: string;
}

interface DatePickerBaseProps extends Omit<DayPickerProps, 'onChange'> {
  label?: string;
  onChange?: (val: string) => void;
  value?: string;
  error?: boolean;
  helperText?: string;
  readOnly?: boolean;
  slotProps?: {
    textField?: TextFieldProps;
    popover?: PopoverProps;
  };
  customModifiers?: (modifiers: Modifiers) => IconButtonProps;
}

const DatePickerBase = ({
  className,
  label,
  mode = 'single',
  onChange,
  value,
  error,
  helperText,
  readOnly,
  slotProps,
  customModifiers,
  ...props
}: DatePickerBaseProps) => {
  const [textInputValue, setTextInputValue] = useState('');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedDateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [selectedDateMultiple, setSelectedDateMultiple] = useState<Date[]>([]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!readOnly) setAnchorEl(event.currentTarget);
  };

  const getButtonProps = useCallback(
    (modifiers: Modifiers): any => {
      const customModifier = customModifiers?.(modifiers) || {};

      if (Object.keys(customModifier).length) {
        return customModifier;
      }

      if (modifiers.range_middle) {
        return {
          color: 'primary',
          variant: 'dashed',
        };
      }

      if (modifiers.selected) {
        return {
          color: 'primary',
          variant: 'contained',
        };
      }

      if (modifiers.today) {
        return {
          variant: 'outlined',
        };
      }

      return {};
    },
    [customModifiers],
  );

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'date-range-picker-popover' : undefined;

  const handleSelectSingle = (date: Date | undefined) => {
    if (date) {
      const text = dayjs(date).format('YYYY-MM-DD');

      setSelectedDate(date);
      setTextInputValue(text);
      onChange?.(text);
      handleClose();
    }
  };

  const handleSelectRange = (
    range: { from: Date | undefined; to: Date | undefined } | undefined,
  ) => {
    if (range && range.from && range.to) {
      const text = `${dayjs(range.from).format('YYYY-MM-DD')} to ${dayjs(range.to).format('YYYY-MM-DD')}`;

      setDateRange(range);
      setTextInputValue(text);
      onChange?.(text);
    }
  };

  const handleSelectMultiple = (dates: Date[] | undefined) => {
    if (dates) {
      const text = dates.map((date) => dayjs(date).format('YYYY-MM-DD')).join(', ');

      setSelectedDateMultiple(dates);
      setTextInputValue(text);
      onChange?.(text);
    }
  };

  useEffect(() => {
    if (typeof value !== 'undefined') {
      if (mode === 'single') {
        setSelectedDate(dayjs(value || undefined).toDate());
        setTextInputValue(value);
      } else if (mode === 'range') {
        const [from, to] = value.split(' to ');

        setDateRange({
          from: dayjs(from || undefined).toDate(),
          to: dayjs(to || undefined).toDate(),
        });
        setTextInputValue(value);
      } else if (mode === 'multiple') {
        const dates = value.split(', ').map((date) => dayjs(date).toDate());

        setSelectedDateMultiple(dates);
        setTextInputValue(value);
      }
    }
  }, [value]);

  return (
    <>
      <Box className={cn(className)}>
        <TextInput
          fullWidth
          {...slotProps?.textField}
          label={label}
          value={textInputValue}
          error={error}
          helperText={helperText}
          slotProps={{
            input: {
              onClick: handleClick,
              readOnly: true,
              className: readOnly ? undefined : 'bg-transparent',
              endAdornment: (
                <InputAdornment position="end">
                  <CalendarIcon size={'1rem'} />
                </InputAdornment>
              ),
              ...slotProps?.textField?.slotProps?.input,
            },
          }}
        />
        {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        disableScrollLock
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        slotProps={{
          ...slotProps?.popover,
          paper: {
            variant: 'outlined',
            ...slotProps?.popover?.slotProps?.paper,
            className: cn('p-2'),
          },
        }}
      >
        <DayPicker
          showOutsideDays
          captionLayout="dropdown"
          {...props}
          mode={mode}
          selected={
            (() => {
              switch (mode) {
                case 'single':
                  return selectedDate;
                case 'range':
                  return selectedDateRange;
                default:
                  return selectedDateMultiple;
              }
            })() as any
          }
          onSelect={
            (() => {
              switch (mode) {
                case 'single':
                  return handleSelectSingle;
                case 'range':
                  return handleSelectRange;
                default:
                  return handleSelectMultiple;
              }
            })() as any
          }
          classNames={{
            ...getDefaultClassNames(),
            month_caption: 'pl-3 my-2 text-lg',
          }}
          components={{
            DayButton(buttonProps) {
              const { day, modifiers, onClick, ...restProps } = buttonProps;

              return (
                <IconButton
                  {...restProps}
                  {...getButtonProps({ ...modifiers, day: day.date } as Modifiers)}
                  onClick={onClick}
                  className="h-11 w-11 text-sm"
                >
                  {dayjs(day.date).format('DD')}
                </IconButton>
              );
            },
            /* eslint-disable react/prop-types */
            NextMonthButton: ({ onClick }) => (
              <IconButton color="primary" onClick={onClick}>
                <ChevronLeft className="rotate-180" />
              </IconButton>
            ),
            PreviousMonthButton: ({ onClick }) => (
              <IconButton color="primary" onClick={onClick}>
                <ChevronLeft />
              </IconButton>
            ),
            Chevron({ className: _className, ..._props }) {
              return <ChevronDown {..._props} className={cn('mt-1 !fill-none', _className)} />;
            },
            /* eslint-enable react/prop-types */
          }}
          required
        />
      </Popover>
    </>
  );
};

interface Props<T extends FieldValues> extends Omit<DayPickerProps, 'onChange'> {
  control?: Control<T, any, FieldValues>;
  name: Path<T>;
  label?: string;
  value?: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  customModifiers?: (modifiers: Modifiers) => IconButtonProps;
  slotProps?: {
    textField?: TextFieldProps;
    popover?: PopoverProps;
  };
  helperText?: string;
}

const DatePicker = <T extends FieldValues>({ control, name, ...props }: Props<T>) => {
  return control ? (
    <ControllWrapper
      name={name}
      control={control}
      render={(params) => <DatePickerBase {...params} {...props} />}
    />
  ) : (
    <DatePickerBase {...props} />
  );
};

export default DatePicker;
