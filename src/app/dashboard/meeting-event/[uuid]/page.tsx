'use client';

import React, { use } from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetMeetingEvent from '@/services/meeting-events/usegetMeetingEvent';
import useUpdateMeetingEvents from '@/services/meeting-events/useUpdateMeetingEvents';

import MeetingEventsForm from '../_components/MeetingEventsForm';
import { MeetingEventsFormType } from '../_utils/meeting-events-schema';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const { data: meetingEvent, isLoading } = useGetMeetingEvent(uuid);

  const { mutate, isPending } = useUpdateMeetingEvents(uuid);

  const breadcrumbs = [
    {
      label: 'Meeting Room',
      href: '/dashboard/meeting-event',
    },
    {
      label: 'Edit Meeting Room',
    },
  ];

  const handleSubmit = (data: MeetingEventsFormType, ...rest: any[]) => {
    const newData = { ...data };

    if (data) {
      newData.images = data.images.map((d) => {
        if (typeof d === 'string') {
          const image = meetingEvent?.photo.find((img: any) => img.url === d);

          return image?.uuid || '';
        }
        return d;
      });
    }

    mutate(newData, ...rest);
  };

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Edit Meeting Room"
          subTitle="Edit a meeting room option here."
          breadcrumbs={breadcrumbs}
        />

        <MeetingEventsForm
          onSubmit={(d) => handleSubmit(d)}
          initialValues={
            meetingEvent && {
              name: meetingEvent?.name || '',
              description: meetingEvent?.description || '',
              location: meetingEvent?.location || '',
              capacity: meetingEvent?.capacity || 0,
              images: meetingEvent?.photo?.map((photo) => photo.url) || [],
              version: meetingEvent?.version || null,
              code: meetingEvent?.code || '',
              rate: meetingEvent?.rate || 0,
              meeting_packages: meetingEvent?.packages?.map((pkg) => pkg.uuid) || [],
              layouts: meetingEvent?.layouts?.map((layout) => layout.uuid) || [],
              is_published_cms: !!meetingEvent?.is_published_cms || false,
            }
          }
          isLoading={isPending || isLoading}
        />
      </div>
    </>
  );
};

export default Page;
