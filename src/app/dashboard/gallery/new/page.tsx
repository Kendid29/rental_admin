'use client';

import React from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreateGallery from '@/services/gallery/useCreateGallery';

import GalleryForm from '../_components/GalleryForm';

const Page = () => {
  const { mutate, isPending } = useCreateGallery();

  const breadcrumbs = [
    {
      label: 'Gallery',
      href: '/dashboard/gallery',
    },
    {
      label: 'New Photo',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Create New Photo"
          subTitle="Add a new photo to the public gallery."
          breadcrumbs={breadcrumbs}
        />

        <GalleryForm onSubmit={(d) => mutate(d)} isLoading={isPending} />
      </div>
    </>
  );
};

export default Page;
