'use client';

import React from 'react';

import Link from 'next/link';

import { Button } from '@mui/material';

import { PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { useTranslation } from '@/lib/hooks/useTranslation';

import GalleryTable from './_components/GalleryTable';

const GalleryPage = () => {
  const { isZh } = useTranslation();
  const breadcrumbs = [
    {
      label: 'Content Management',
    },
    {
      label: 'Gallery',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Gallery List"
          subTitle="Manage public landing page gallery photos here."
          breadcrumbs={breadcrumbs}
        >
          <Button
            LinkComponent={Link}
            href={'/dashboard/gallery/new'}
            variant="contained"
            color="primary"
            startIcon={<PlusCircle size={'1rem'} />}
          >
            {isZh ? '新增照片' : 'Add Photo'}
          </Button>
        </DashboardTitle>

        <GalleryTable />
      </div>
    </>
  );
};

export default GalleryPage;
