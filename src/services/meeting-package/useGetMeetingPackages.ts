import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import MeetingPackageType from '@/lib/types/meeting-package.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<
  UseQueryOptions<ResponseWrapperType<MeetingPackageType[]>>,
  'queryKey'
> {
  params?: Record<string, string>;
}

const useGetMeetingPackages = (options?: Options) => {
  return useQuery<ResponseWrapperType<MeetingPackageType[]>>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(
        `/master-data/meeting-package?${new URLSearchParams(options?.params)}`,
      );

      return res;
    },
    queryKey: [TAGS.MEETING_PACKAGES, options?.params],
  });
};

export default useGetMeetingPackages;
