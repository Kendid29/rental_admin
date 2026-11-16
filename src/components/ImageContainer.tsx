'use client';

import { useEffect, useState } from 'react';
import { type StaticImageData } from 'next/image';
import { cn } from '@/lib/utils';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  src: string | StaticImageData;
  alt: string;
}

const ImageContainer = ({ className, src, alt = '', children, ...props }: Props) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const fallbackSrc = '/img/lanadiya-logo.png';
  const resolvedSrc = typeof imgSrc === 'string' ? imgSrc : (imgSrc as any)?.src || '';

  return (
    <div {...props} className={cn('relative overflow-hidden bg-gray-100', className)}>
      <img
        src={resolvedSrc || fallbackSrc}
        alt={alt}
        className="absolute inset-0 z-10 h-full w-full object-cover object-center"
        onError={() => {
          if (imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
          }
        }}
      />
      {children && <div className="relative z-20 size-full">{children}</div>}
    </div>
  );
};

export default ImageContainer;
