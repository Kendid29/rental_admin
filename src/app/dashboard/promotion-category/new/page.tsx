'use client';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreatePromotionCategory from '@/services/promotion-category/useCreatePromotionCategory';

import PromotionCategoryForm from '../_components/PromotionCategoryForm';

const PromotionCategoryEditPage = () => {
  const { mutate, isPending } = useCreatePromotionCategory();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Create New Promotion Category"
          subTitle="Create a new promotion category here."
          breadcrumbs={[
            {
              label: 'Promotion Category',
              href: '/dashboard/promotion-category',
            },
            {
              label: 'Create New Promotion Category',
            },
          ]}
        />

        <PromotionCategoryForm
          onSubmit={(d, options) => mutate(d, options)}
          isLoading={isPending}
        />
      </div>
    </>
  );
};

export default PromotionCategoryEditPage;
