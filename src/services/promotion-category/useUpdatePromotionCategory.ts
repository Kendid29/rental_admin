import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { PromotionCategoryFormType } from '@/app/dashboard/promotion-category/_utils/promotion-category-schema';
import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

const useUpdatePromotionCategory = (
  uuid: string,
  options?: UseMutationOptions<any, unknown, PromotionCategoryFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) => fetchHelper(`/promo/category/${uuid}`, 'PUT', data),
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.PROMOTION_CATEGORY] });
      toast('Promotion category updated successfully', { type: 'success' });

      router.push('/dashboard/promotion-category');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useUpdatePromotionCategory;
