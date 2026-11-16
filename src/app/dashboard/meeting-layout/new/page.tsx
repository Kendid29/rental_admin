'use client';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreateMeetingLayout from '@/services/meeting-layout/useCreateMeetingLayout';

import MeetingLayoutForm from '../_components/MeetingLayoutForm';

const PromotionCategoryEditPage = () => {
  const { mutate, isPending } = useCreateMeetingLayout();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Create New Meeting Layout"
          subTitle="Create a new meeting layout here."
          breadcrumbs={[
            {
              label: 'Meeting Layout',
              href: '/dashboard/meeting-layout',
            },
            {
              label: 'Create New Meeting Layout',
            },
          ]}
        />

        <MeetingLayoutForm onSubmit={(d, options) => mutate(d, options)} isLoading={isPending} />
      </div>
    </>
  );
};

export default PromotionCategoryEditPage;
