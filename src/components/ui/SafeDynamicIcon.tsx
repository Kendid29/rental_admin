'use client';

import React, { lazy, Suspense } from 'react';
import { Check, type LucideProps } from 'lucide-react';

interface SafeDynamicIconProps extends Omit<LucideProps, 'ref' | 'name'> {
  name?: string | null;
  fallback?: React.ReactNode;
}

export const SafeDynamicIcon = ({
  name,
  size,
  className,
  fallback,
  ...props
}: SafeDynamicIconProps) => {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return <>{fallback || null}</>;
  }

  const pascalName = name
    .trim()
    .split('-')
    .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  const IconComponent = lazy(() =>
    import('lucide-react')
      .then((module: any) => {
        const Icon = module[pascalName];
        if (!Icon) {
          return { default: () => <>{fallback || <Check size={size} className={className} />}</> };
        }
        return { default: Icon };
      })
      .catch(() => ({ default: () => <>{fallback || <Check size={size} className={className} />}</> })),
  ) as React.ComponentType<any>;

  return (
    <Suspense fallback={fallback || <div style={{ width: size, height: size }} className={className} />}>
      <IconComponent size={size} className={className} {...props} />
    </Suspense>
  );
};

export default SafeDynamicIcon;
