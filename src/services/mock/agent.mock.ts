import { AgentType } from '@/lib/types/agent.type';

import { createSuccessResponse } from './common';
import { MockRequestContext, MockResult } from './types';

const agentDb: AgentType[] = [
  {
    uuid: 'agent-001',
    name: 'John Agent',
    email: 'john@agent.com',
    phone_number: '08123456789',
    location: 'Jakarta',
    company: 'Agent Corp',
    version: 1,
  },
  {
    uuid: 'agent-002',
    name: 'Jane Doe',
    email: 'jane@travelco.com',
    phone_number: '08198765432',
    location: 'Bali',
    company: 'Travel Co',
    version: 1,
  },
];

const createPagination = (page: number, perPage: number, totalData: number) => {
  const totalPage = Math.max(1, Math.ceil(totalData / perPage));
  const currentPage = Math.min(Math.max(page, 1), totalPage);

  return {
    data_per_page: perPage,
    next_page: currentPage < totalPage ? currentPage + 1 : 0,
    prev_page: currentPage > 1 ? currentPage - 1 : 0,
    first_page: 1,
    last_page: totalPage,
    next_page_url: '',
    previous_page_url: '',
    first_page_url: '',
    last_page_url: '',
    total_page: totalPage,
    total_data: totalData,
  };
};

const parsePagingParams = (queryParams: URLSearchParams) => {
  return {
    page: Number(queryParams.get('page') || '1'),
    perPage: Number(queryParams.get('per_page') || '10'),
  };
};

const paginate = <T>(items: T[], page: number, perPage: number) => {
  const start = (Math.max(page, 1) - 1) * Math.max(perPage, 1);
  const end = start + Math.max(perPage, 1);

  return {
    data: items.slice(start, end),
    pagination: createPagination(page, perPage, items.length),
  };
};

const filterAgent = (search: string) => {
  if (!search) return agentDb;

  return agentDb.filter((item) => {
    return (
      item.name.toLowerCase().includes(search) ||
      item.email.toLowerCase().includes(search) ||
      item.phone_number.toLowerCase().includes(search) ||
      (item.company && item.company.toLowerCase().includes(search)) ||
      (item.city && item.city.toLowerCase().includes(search))
    );
  });
};

export const handleAgentMock = ({
  path,
  queryParams,
  method,
  data,
}: MockRequestContext): MockResult => {
  if (path === '/agent' && method === 'GET') {
    const { page, perPage } = parsePagingParams(queryParams);
    const search = (queryParams.get('search_param') || '').toLowerCase();
    const filtered = filterAgent(search);
    const result = paginate(filtered, page, perPage);

    return {
      data: result.data,
      success: true,
      message: 'Success',
      pagination: result.pagination,
    };
  }

  if (path === '/agent' && method === 'POST') {
    const newAgent: AgentType = {
      uuid: `agent-${Date.now()}`,
      ...data,
      version: 1,
    };

    agentDb.push(newAgent);
    return createSuccessResponse(newAgent);
  }

  const detailMatch = path.match(/^\/agent\/([^/]+)$/u);

  if (detailMatch) {
    const uuid = detailMatch[1];
    const index = agentDb.findIndex((item) => item.uuid === uuid);

    if (method === 'GET') {
      return createSuccessResponse(index !== -1 ? agentDb[index] : null);
    }

    if (method === 'PUT' && index !== -1) {
      agentDb[index] = {
        ...agentDb[index],
        ...data,
        version: agentDb[index].version + 1,
      };
      return createSuccessResponse(agentDb[index]);
    }

    if (method === 'DELETE' && index !== -1) {
      agentDb.splice(index, 1);
      return createSuccessResponse(null);
    }
  }

  return undefined;
};
