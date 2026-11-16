'use client';

import React, { use } from 'react';

import { Card, CircularProgress, Typography } from '@mui/material';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetGallery from '@/services/gallery/useGetGallery';
import useUpdateGallery from '@/services/gallery/useUpdateGallery';

import GalleryForm from '../_components/GalleryForm';
import { GalleryFormType } from '../_utils/gallery-schema';

const Page = ({ params: paramsPromise }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(paramsPromise);

  // Fetch gallery item details via API
  const { data: resData, isLoading: isLoadingDetail } = useGetGallery(uuid);
  const item = resData?.data;

  const { mutate, isPending: isUpdating } = useUpdateGallery();

  const breadcrumbs = [
    {
      label: 'Gallery',
      href: '/dashboard/gallery',
    },
    {
      label: 'Edit Photo',
    },
  ];

  const handleSubmit = (formData: GalleryFormType) => {
    const newData = { ...formData };

    // If image was not changed, it remains a URL string. Map it back to the original image UUID.
    if (typeof formData.image_uuid === 'string') {
      newData.image_uuid = item?.image_uuid || item?.image?.uuid || '';
    }

    mutate({ uuid, data: newData });
  };

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Edit Photo"
          subTitle="Edit photo details here."
          breadcrumbs={breadcrumbs}
        />

        {isLoadingDetail ? (
          <Card variant="outlined" className="p-16 text-center bg-white rounded-2xl mt-8 flex justify-center">
            <CircularProgress color="primary" />
          </Card>
        ) : !item ? (
          <Card variant="outlined" className="p-8 text-center bg-white rounded-2xl mt-8">
            <Typography variant="h6" className="text-red-500 mb-2">
              Photo Not Found
            </Typography>
            <Typography variant="body2" className="text-stone-400">
              The photo with UUID &quot;{uuid}&quot; does not exist or has been deleted.
            </Typography>
          </Card>
        ) : (
          <GalleryForm
            onSubmit={handleSubmit}
            isLoading={isUpdating}
            initialValues={{
              image_uuid: item.image?.url || item.image_url || item.imageurl || '',
              is_active: item.status === 'active',
              version: item.version,
            }}
          />
        )}
      </div>
    </>
  );
};

export default Page;
