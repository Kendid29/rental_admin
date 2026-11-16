import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { VoucherCategoryFormType } from '@/app/dashboard/voucher-category/_utils/voucher-category-schema';
import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

const useCreateVoucherCategory = (
  options?: UseMutationOptions<any, unknown, VoucherCategoryFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) => {
      const payload = {
        ...data,
        is_published: data.is_published ? 1 : 0,
        is_published_cms: data.is_published_cms ? 1 : 0,
      };
      return fetchHelper('/promo/voucher/category', 'POST', payload);
    },
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.VOUCHER_CATEGORY] });
      toast('Voucher category created successfully', { type: 'success' });

      router.push('/dashboard/voucher-category');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useCreateVoucherCategory;
