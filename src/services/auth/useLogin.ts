'use client';

import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { setCookie } from 'cookies-next/client';
import { toast } from 'react-toastify';

import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

interface FormBody {
  email: string;
  password: string;
}

const useLogin = (options?: UseMutationOptions<any, unknown, FormBody, unknown>) => {
  const [roleUuid, setRoleUuid] = useState<string>();

  const queryClient = getQueryCLient();
  const router = useRouter();
  const params = useSearchParams();
  // const { data: permissionsData } = useGetPermissionUser(roleUuid);

  // useEffect(() => {
  //   if (permissionsData) {
  //     const fallbackUrl = params.get('fallback');

  //     router.push(fallbackUrl || '/dashboard/home');

  //     queryClient.invalidateQueries({ queryKey: [TAGS.AUTH, TAGS.PERMISSIONS] });

  //     if (callback) callback();
  //   }
  // }, [permissionsData]);

  return useMutation<any, any, FormBody>({
    ...options,
    async mutationFn({ email, password }: { email: string; password: string }) {
      const result = await fetchHelper('/auth/login', 'POST', {
        email,
        password,
        is_admin_site: true,
      });

      return result;
    },
    onSuccess(data, variables, onMutateResult, context) {
      setCookie('rk_token', data.data.token, {
        sameSite: true,
        secure: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      toast(data.message, { type: 'success' });

      const fallbackUrl = params.get('fallback');

      if (fallbackUrl && fallbackUrl !== '/login') {
        router.push(fallbackUrl);
      } else {
        router.push('/dashboard/admin');
      }

      queryClient.invalidateQueries({ queryKey: [TAGS.AUTH, TAGS.PERMISSIONS] });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError(err, variables, onMutateResult, context) {
      // toast((err as any).response.data.message.match(/"([^"]*)"/u)[1], { type: 'error' });
      toast(err.response.data.message, { type: 'error' });
      options?.onError?.(err, variables, onMutateResult, context);
    },
  });
};

export default useLogin;
