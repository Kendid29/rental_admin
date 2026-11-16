'use client';

import React from 'react';

import Link from 'next/link';

import { Typography } from '@mui/material';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';

import { useTranslation } from '@/lib/hooks/useTranslation';

interface Props {
  breadcrumbs: {
    label: string;
    href?: string;
  }[];
}

const Breadcrumbs = ({ breadcrumbs }: Props) => {
  const { isZh, tPage } = useTranslation();

  return (
    <MuiBreadcrumbs className="mb-2">
      <Link href={'/dashboard/admin'}>
        <Typography className="hover:underline" variant="body2">
          {isZh ? '首页' : 'Home'}
        </Typography>
      </Link>
      {breadcrumbs.map((breadcrumb, index) =>
        breadcrumb.href ? (
          <Link key={index} href={breadcrumb.href}>
            <Typography className="font-normal hover:underline" variant="body2">
              {tPage(breadcrumb.label)}
            </Typography>
          </Link>
        ) : (
          <Typography variant="body2" key={index} className="font-bold">
            {tPage(breadcrumb.label)}
          </Typography>
        ),
      )}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
