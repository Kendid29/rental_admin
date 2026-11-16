import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import _ from 'lodash';
import { toast } from 'react-toastify';

import TAGS from '@/constant/tags';
import { PermissionType } from '@/lib/types/permission.type';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

type MutationContext = {
  previousData?: PermissionType[];
};

const useTogglePermission = (
  role_uuid: string,
  options?: UseMutationOptions<
    void,
    Error,
    { uuid: string; module_name: string; permission_name: string; value: boolean },
    MutationContext
  >,
) => {
  const queryClient = getQueryCLient();

  return useMutation<
    void,
    Error,
    { uuid: string; module_name: string; permission_name: string; value: boolean },
    MutationContext
  >({
    ...options,
    async mutationFn({ uuid, module_name, permission_name, value }) {
      return await fetchHelper(`/auth/role-permission`, 'PUT', {
        role_uuid,
        permission_uuid: uuid,
        module_name,
        permission_name,
        value,
      });
    },
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);
      queryClient.invalidateQueries({ queryKey: [TAGS.PERMISSIONS, role_uuid] });
      toast('Permission berhasil diperbarui', { type: 'success' });
    },
    async onMutate({ module_name, permission_name, value }) {
      await queryClient.cancelQueries({ queryKey: [TAGS.PERMISSIONS, role_uuid] });

      const previousData = queryClient.getQueryData<PermissionType[]>([
        TAGS.PERMISSIONS,
        role_uuid,
      ]);

      if (previousData) {
        queryClient.setQueryData<PermissionType[]>([TAGS.PERMISSIONS, role_uuid], (oldData) => {
          if (oldData?.find((item) => item.module_name === module_name)) {
            return oldData?.map((item) => {
              if (item.module_name === module_name) {
                return {
                  ...item,
                  accesses: item.accesses.map((data) => {
                    return {
                      ...data,
                      [permission_name]: value,
                    };
                  }),
                };
              }
              return item;
            });
          }
          return [
            ...(oldData || []),
            {
              module_name,
              accesses: [{ [permission_name]: value }],
            },
          ];
        });
      }

      return { previousData };
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      queryClient.setQueryData([TAGS.PERMISSIONS, role_uuid], onMutateResult?.previousData);
      toast(
        `Failed to update permission ${_.words(variables.module_name.replaceAll('_', ' ')).map(_.capitalize).join(' ')}`,
        { type: 'error' },
      );
    },
    onSettled(data, error, variables, onMutateResult, context) {
      options?.onSettled?.(data, error, variables as any, onMutateResult, context);

      // queryClient.invalidateQueries({ queryKey: [TAGS.PERMISSIONS, role_uuid] });
    },
  });
};

export default useTogglePermission;
