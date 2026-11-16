import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import { AgentType } from '@/lib/types/agent.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<ResponseWrapperType<AgentType[]>>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetAgents = (options?: Options) => {
  return useQuery<ResponseWrapperType<AgentType[]>>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(`/agent?${new URLSearchParams(options?.params)}`);

      return res;
    },
    queryKey: [TAGS.AGENT, options?.params],
  });
};

export default useGetAgents;
