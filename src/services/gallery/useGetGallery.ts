import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { GalleryItemType } from '@/lib/types/gallery.type';
import { ResponseWrapperType } from '@/lib/types/globals';

import fetchHelper from '../fetchHelper';

const useGetGallery = (
  uuid: string,
  options?: Omit<UseQueryOptions<ResponseWrapperType<GalleryItemType>>, 'queryKey'>,
) => {
  return useQuery<ResponseWrapperType<GalleryItemType>>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(`/gallery/admin/${uuid}/detail`);
      return res;
    },
    queryKey: [TAGS.GALLERY, uuid],
    enabled: !!uuid && options?.enabled !== false,
  });
};

export default useGetGallery;
