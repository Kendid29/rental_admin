import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { AllPermissionsType } from '@/lib/types/permission.type';

import fetchHelper from '../fetchHelper';

const useGetPermissions = (options?: UseQueryOptions<AllPermissionsType[]>) => {
  return useQuery<AllPermissionsType[]>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(`/auth/permission`);

      const mockGallery: AllPermissionsType[] = [
        {
          uuid: 'gallery-read',
          module_key: 'gallery',
          module_name: 'Gallery',
          permission_name: 'Read',
        },
        {
          uuid: 'gallery-create',
          module_key: 'gallery',
          module_name: 'Gallery',
          permission_name: 'Create',
        },
        {
          uuid: 'gallery-update',
          module_key: 'gallery',
          module_name: 'Gallery',
          permission_name: 'Update',
        },
        {
          uuid: 'gallery-delete',
          module_key: 'gallery',
          module_name: 'Gallery',
          permission_name: 'Delete',
        },
      ];

      return Array.isArray(res.data) ? [...res.data, ...mockGallery] : mockGallery;
    },
    queryKey: [TAGS.PERMISSIONS],
  });
};

export default useGetPermissions;
