'use client';

import React, { use } from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetMeetingLayout from '@/services/meeting-layout/useGetMeetingLayout';
import useUpdateMeetingLayout from '@/services/meeting-layout/useUpdateMeetingLayout';

import MeetingLayoutForm from '../_components/MeetingLayoutForm';
import { MeetingLayoutFormType } from '../_utils/meeting-layout-schema';

const PromotionCategoryEditPage = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const { data, isLoading } = useGetMeetingLayout(uuid);

  const { mutate, isPending } = useUpdateMeetingLayout(uuid);

  const handleSubmit = (d: MeetingLayoutFormType, ...rest: any[]) => {
    const newData = { ...d };

    if (typeof d.photo_uuid === 'string') {
      newData.photo_uuid = data?.photo?.uuid || '';
    }

    mutate(newData, ...rest);
  };

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Edit Meeting Layout"
          subTitle="Edit your meeting layout here."
          breadcrumbs={[
            {
              label: 'Meeting Layout',
              href: '/dashboard/meeting-layout',
            },
            {
              label: 'Edit Meeting Layout',
            },
          ]}
        />

        <MeetingLayoutForm
          onSubmit={(d, options) => handleSubmit(d, options)}
          initialValues={
            data && {
              name: data.name,
              code: data.code || '',
              description: data.description || '',
              photo_uuid: data.photo?.url || '',
              is_published_cms: !!data.is_published_cms,
              version: data.version,
            }
          }
          isLoading={isPending || isLoading}
        />
      </div>
    </>
  );
};

export default PromotionCategoryEditPage;
