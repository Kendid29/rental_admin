import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { GalleryItemType } from '@/lib/types/gallery.type';
import { ResponseWrapperType } from '@/lib/types/globals';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<ResponseWrapperType<GalleryItemType[]>>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetGalleries = (options?: Options) => {
  return useQuery<ResponseWrapperType<GalleryItemType[]>>({
    ...options,
    async queryFn() {
      const searchParams = new URLSearchParams();
      if (options?.params) {
        Object.entries(options.params).forEach(([key, val]) => {
          if (val) {
            searchParams.append(key, val);
          }
        });
      }
      
      const queryString = searchParams.toString();
      const url = `/gallery/admin${queryString ? `?${queryString}` : ''}`;
      
      const res = await fetchHelper(url);
      return res;
    },
    queryKey: [TAGS.GALLERY, options?.params],
  });
};

export default useGetGalleries;
