'use client';

import React, { useRef } from 'react';

import { ButtonBase, ButtonBaseProps, Card, SwitchProps, Typography } from '@mui/material';

import { Control, FieldValues, Path } from 'react-hook-form';

import { useTranslation } from '@/lib/hooks/useTranslation';
import { cn } from '@/lib/utils';

import Switch from './Switch';

type SwitchSlotProps = NonNullable<SwitchProps['slotProps']>;

interface Props<T extends FieldValues> extends Omit<SwitchProps, 'slotProps'> {
  name: Path<T>;
  control?: Control<T, any, FieldValues>;
  label?: React.ReactNode;
  description?: string;
  slotProps?: SwitchSlotProps & {
    card?: ButtonBaseProps;
  };
}

const SwitchCard = <T extends FieldValues>({
  name,
  control,
  label,
  description,
  slotProps,
  ...props
}: Props<T>) => {
  const { tCommon, tPage } = useTranslation();
  const { card, ...switchSlotProps } = slotProps || {};

  const ref = useRef<HTMLButtonElement>(null);

  const translatedLabel = typeof label === 'string' ? tCommon(label) : label;
  const translatedDesc = typeof description === 'string' ? tPage(description) : description;

  return (
    <Card
      variant="outlined"
      component={ButtonBase}
      {...card}
      className={cn('flex justify-between', card?.className)}
      onClick={(e: any) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          ref.current.click();
        }
      }}
    >
      <div className="flex flex-col items-start text-left" id="publish-card">
        <Typography variant="body1">{translatedLabel}</Typography>
        <Typography variant="body2">{translatedDesc}</Typography>
      </div>
      <Switch control={control} name={name} slotProps={switchSlotProps} {...props} ref={ref} />
    </Card>
  );
};

export default SwitchCard;
