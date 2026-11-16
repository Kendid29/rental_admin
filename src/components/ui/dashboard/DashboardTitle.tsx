'use client';

import React, { Children, cloneElement, HTMLProps, isValidElement } from 'react';

import Typography from '@mui/material/Typography';

import { useTranslation } from '@/lib/hooks/useTranslation';

import Breadcrumbs from './Breadcrumbs';

interface Props extends HTMLProps<HTMLDivElement> {
  title: string;
  subTitle?: string;
  children?: React.ReactNode;
  breadcrumbs?: {
    label: string;
    href?: string;
  }[];
}

const DashboardTitle = ({ breadcrumbs, title, subTitle, children }: Props) => {
  const { tPage, tCommon } = useTranslation();

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
    <>
      {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Typography variant="h6">{tPage(title)}</Typography>
          {subTitle && <Typography variant="body2">{tPage(subTitle)}</Typography>}
        </div>

        {React.Children.map(children, translateNode)}
      </div>
    </>
  );
};

export default DashboardTitle;
