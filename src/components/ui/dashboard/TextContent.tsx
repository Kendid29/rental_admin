import React from 'react';

import { Typography } from '@mui/material';

import { useTranslation } from '@/lib/hooks/useTranslation';
import { cn } from '@/lib/utils';

interface Props {
  label: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  textClassName?: string;
  isText?: boolean;
  Icon?: React.ReactNode;
  direction?: 'vertical' | 'horizontal';
  isNormalText?: boolean;
}

const TextContent = ({
  label,
  children,
  className,
  textClassName,
  isText = true,
  Icon,
  direction = 'vertical',
  isNormalText = false,
}: Props) => {
  const { tCommon } = useTranslation();
  const translatedLabel = typeof label === 'string' ? tCommon(label) : label;
  return (
    <div
      className={cn(
        'w-full',
        direction === 'vertical' && 'flex flex-col flex-nowrap',
        direction === 'horizontal' && 'flex flex-row flex-nowrap gap-2',
        className,
      )}
    >
      {children ? (
        <>
          <Typography
            className={cn('mb-1 flex items-center gap-1 text-xs', !isNormalText && 'text-zinc-500')}
          >
            {Icon}
            {translatedLabel}
          </Typography>
          {isText ? (
            <Typography className={cn('leading-4', textClassName)}>{children}</Typography>
          ) : (
            children
          )}
        </>
      ) : (
        <>
          <div
            className={cn(
              'h-4 w-1/3 animate-pulse rounded bg-gray-200',
              direction === 'horizontal' && 'w-1/2',
            )}
          />
          <div
            className={cn(
              'mt-1 h-5 w-full animate-pulse rounded bg-gray-200',
              direction === 'horizontal' && 'mt-0 h-4 w-1/3',
            )}
          />
        </>
      )}
    </div>
  );
};

export default TextContent;
