'use client';

import React, { Children, cloneElement, isValidElement, useRef } from 'react';

import { ButtonBase, ButtonBaseProps, Card } from '@mui/material';

import { Control, FieldValues, Path } from 'react-hook-form';

import { useTranslation } from '@/lib/hooks/useTranslation';
import { cn } from '@/lib/utils';

import Checkbox, { CheckboxProps } from './Checkbox';

type CheckboxSlotProps = NonNullable<CheckboxProps<any>['slotProps']>;

interface Props<T extends FieldValues> extends Omit<CheckboxProps<T>, 'label'> {
  name?: Path<T>;
  control?: Control<T, any, FieldValues>;
  label: React.ReactNode;
  slotProps?: CheckboxSlotProps & {
    card?: ButtonBaseProps;
  };
}

const CheckboxCard = <T extends FieldValues>({
  name,
  control,
  label,
  slotProps,
  ...props
}: Props<T>) => {
  const { tCommon } = useTranslation();
  const { card, ...checkboxSlotProps } = slotProps || {};

  const ref = useRef<HTMLButtonElement>(null);

  const translateNode = (node: React.ReactNode): React.ReactNode => {
    if (!node) return node;
    if (typeof node === 'string') {
      return tCommon(node);
    }
    if (isValidElement(node)) {
      const element = node as React.ReactElement<any>;

      if (typeof element.props?.children === 'string') {
        return cloneElement(element, {
          children: tCommon(element.props.children),
        });
      }

      if (Array.isArray(element.props?.children)) {
        return cloneElement(element, {
          children: Children.map(element.props.children, translateNode),
        });
      }
    }

    return node;
  };

  return (
    <Card
      variant="outlined"
      {...card}
      onClick={(e) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          ref.current.click();
        }
      }}
      component={ButtonBase}
      className={cn('flex flex-nowrap items-center justify-start p-2 pl-4', card?.className)}
    >
      <Checkbox name={name} control={control} slotProps={checkboxSlotProps} {...props} ref={ref} />
      {translateNode(label)}
    </Card>
  );
};

export default CheckboxCard;
