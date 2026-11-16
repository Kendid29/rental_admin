import { SyntheticEvent, useEffect } from 'react';

import MuiAutocomplete, {
  type AutocompleteProps,
  AutocompleteRenderInputParams,
} from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import Paper, { type PaperProps } from '@mui/material/Paper';
import TextField, { type TextFieldProps } from '@mui/material/TextField';

import { Control, FieldValues, Path } from 'react-hook-form';

import { useTranslation } from '@/lib/hooks/useTranslation';
import { cn } from '@/lib/utils';

import ControllWrapper from './FormControlWrapper';

export interface AutocompleteOptionsType {
  label: string;
  value: string;
}

interface Props<T extends FieldValues> extends Omit<
  AutocompleteProps<AutocompleteOptionsType, boolean, boolean, boolean>,
  'renderInput'
> {
  renderInputProps?: TextFieldProps;
  label?: string;
  control?: Control<T, any, FieldValues>;
  name: Path<T>;
  showSelectAll?: boolean;
  renderInput?: AutocompleteProps<
    AutocompleteOptionsType,
    boolean,
    boolean,
    boolean
  >['renderInput'];
}

interface BaseProps extends AutocompleteProps<AutocompleteOptionsType, boolean, boolean, boolean> {
  onControllerChange: (...event: any[]) => void;
  showSelectAll?: boolean;
}

const BaseAutoComplete = ({
  options,
  renderInput,
  slotProps,
  onChange,
  onControllerChange,
  value,
  readOnly,
  showSelectAll = true,
  ...props
}: BaseProps) => {
  const { tCommon, isZh, isId } = useTranslation();

  const getValue = (v: any | any[]) => {
    if (Array.isArray(v) || props.multiple) {
      if (!Array.isArray(v)) return [];
      return options.filter((option) => v.includes(option.value)) || [];
    }
    return (
      options.find((option) => option.value === (typeof v === 'string' ? v : v?.value)) || null
    );
  };

  const currentValues = Array.isArray(value) ? value : [];
  const allSelected =
    options.length > 0 && options.every((option) => currentValues.includes(option.value));
  const someSelected = currentValues.length > 0 && !allSelected;

  const handleToggleAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (allSelected) {
      onControllerChange([]);
      onChange?.({} as SyntheticEvent, [], 'clear');
    } else {
      const allOptionValues = options.map((d) => d.value);
      onControllerChange(allOptionValues);
      onChange?.({} as SyntheticEvent, options as any, 'selectOption');
    }
  };

  useEffect(() => {
    if (options.length === 0 && !props.loading) {
      if (Array.isArray(value)) {
        onControllerChange([]);
        onChange?.({} as SyntheticEvent, [], 'selectOption');
      } else {
        onControllerChange('');
        onChange?.({} as SyntheticEvent, '', 'selectOption');
      }
    }
  }, [options.length]);

  return (
    <MuiAutocomplete
      options={options}
      getOptionLabel={(option) => {
        const raw = typeof option === 'string' ? option : option?.label || '';

        return tCommon(raw);
      }}
      renderOption={(optionProps, option, { selected }) => {
        const raw = typeof option === 'string' ? option : option?.label || '';
        const { key, ...otherOptionProps } = optionProps as any;

        return (
          <li
            key={key || option.value}
            {...otherOptionProps}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-amber-50/60 transition-colors',
              selected && 'bg-amber-50 font-medium text-amber-900',
              (optionProps as any).className,
            )}
          >
            {props.multiple && (
              <Checkbox
                size="small"
                checked={selected}
                sx={{
                  p: 0,
                  mr: 1,
                  color: '#d4af37',
                  '&.Mui-checked': {
                    color: '#c59b27',
                  },
                }}
              />
            )}
            <span className="truncate">{tCommon(raw)}</span>
          </li>
        );
      }}
      PaperComponent={(paperProps: PaperProps) => {
        return (
          <Paper
            {...paperProps}
            variant="outlined"
            className="overflow-hidden shadow-lg border-slate-200"
            style={{ maxHeight: 320, ...paperProps.style }}
          >
            {props.multiple && showSelectAll && options.length > 1 && (
              <div
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleToggleAll}
                className="flex items-center justify-between px-3 py-2 border-b border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer select-none transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    size="small"
                    checked={allSelected}
                    indeterminate={someSelected}
                    sx={{
                      p: 0,
                      color: '#d4af37',
                      '&.Mui-checked, &.MuiCheckbox-indeterminate': {
                        color: '#c59b27',
                      },
                    }}
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    {allSelected
                      ? isId ? 'Batal Pilih Semua' : isZh ? '取消全选' : 'Deselect All'
                      : isId ? 'Pilih Semua' : isZh ? '全选' : 'Select All'}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full">
                  {currentValues.length}/{options.length} {isId ? 'terpilih' : isZh ? '已选' : 'selected'}
                </span>
              </div>
            )}
            {paperProps.children}
          </Paper>
        );
      }}
      renderInput={renderInput}
      isOptionEqualToValue={(option, val) =>
        typeof val === 'string' ? option.value === val : option.value === val.value
      }
      onChange={(event, val, ...rest) => {
        const typedVal = val as AutocompleteOptionsType | AutocompleteOptionsType[] | null;

        if (Array.isArray(typedVal)) {
          onControllerChange(typedVal.map((d) => d.value));
          onChange?.(
            event,
            typedVal.map((d) => d.value),
            ...rest,
          );
        } else if (typeof typedVal === 'object' && typedVal !== null) {
          onControllerChange(typedVal.value);
          onChange?.(event, typedVal.value, ...rest);
        } else {
          onControllerChange('');
          onChange?.(event, '', ...rest);
        }
      }}
      value={getValue(value)}
      limitTags={props.limitTags ?? (props.multiple ? 2 : undefined)}
      getLimitTagsText={(more) => `+${more} ${isId ? 'lagi' : isZh ? '更多' : 'more'}`}
      slotProps={{
        chip: {
          size: 'small',
          className: 'max-w-44 truncate mr-1 my-0.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium',
        },
        paper: {
          variant: 'outlined',
        },
        ...slotProps,
      }}
      popupIcon={readOnly ? null : props.popupIcon}
      readOnly={readOnly}
      size="small"
      disableCloseOnSelect={props.multiple}
      {...props}
    />
  );
};

const AutoComplete = <T extends FieldValues>({
  renderInputProps = {},
  renderInput,
  name,
  control,
  label,
  ...props
}: Props<T>) => {
  const { tCommon } = useTranslation();
  const rawLabel = label || renderInputProps?.label;
  const translatedLabel = rawLabel && typeof rawLabel === 'string' ? tCommon(rawLabel) : rawLabel;

  return control ? (
    <ControllWrapper
      name={name}
      control={control}
      render={({ onChange, error, helperText, ...field }) => {
        const defaultRenderInput = ({ inputProps, ...params }: AutocompleteRenderInputParams) => {
          return (
            <TextField
              error={error}
              helperText={helperText}
              {...params}
              {...renderInputProps}
              label={translatedLabel}
              className={cn(props.readOnly && 'MuiInputBase-readOnly', renderInputProps.className)}
              inputProps={{ ...inputProps, readOnly: props.readOnly }}
            />
          );
        };

        return (
          <BaseAutoComplete
            {...props}
            {...field}
            renderInput={renderInput || defaultRenderInput}
            onControllerChange={onChange}
          />
        );
      }}
    />
  ) : (
    <BaseAutoComplete
      {...props}
      renderInput={
        renderInput ||
        ((inputProps, ...params) => (
          <TextField {...renderInputProps} label={translatedLabel} {...inputProps} {...params} />
        ))
      }
      onControllerChange={props.onChange || (() => {})}
    />
  );
};

export default AutoComplete;
