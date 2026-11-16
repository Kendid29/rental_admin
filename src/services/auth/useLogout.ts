import { useRouter } from 'nextjs-toploader/app';

import { useMutation } from '@tanstack/react-query';
import { deleteCookie } from 'cookies-next/client';
import { toast } from 'react-toastify';

import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

const useLogout = (callback?: () => void) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    async mutationFn() {
      const result = await fetchHelper('/auth/logout', 'POST');

      return result;
    },
    onSuccess() {
      toast('Logout Successfully', { type: 'success' });

      queryClient.clear();

      if (callback) callback();
    },
    onError(error) {
      toast((error as any).response?.data?.message, { type: 'error' });
    },
    onSettled(data, error, variables, context) {
      deleteCookie('rk_token');
      router.push('/login');
      queryClient.cancelQueries();
    },
  });
};

export default useLogout;
