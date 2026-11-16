import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { PackageTourPricingFormType } from '@/app/dashboard/tour-management/package-tour-pricing/_utils/package-tour-pricing-schema';
import TAGS from '@/constant/tags';
import parseObjectRequest from '@/lib/utils/parseObjectRequest';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

const useUpdatePackageTour = (
  uuid: string,
  options?: UseMutationOptions<any, unknown, PackageTourPricingFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) =>
      fetchHelper(`/master-data/package-tour/${uuid}`, 'PUT', await parseObjectRequest(data)),
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.PACKAGE_TOUR] });
      toast('Package Tour updated successfully', { type: 'success' });

      router.push('/dashboard/tour-management/package-tour');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useUpdatePackageTour;

