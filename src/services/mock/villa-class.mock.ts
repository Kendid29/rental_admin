import { createSuccessResponse } from './common';
import { MockRequestContext, MockResult } from './types';

interface VillaClassRecord {
  uuid: string;
  name: string;
  code: string;
  description: string;
  version: number;
}

const villaClassDb: VillaClassRecord[] = [
  {
    uuid: 'villa-001',
    name: 'Villa 1',
    code: 'V1',
    description: 'First luxury villa complex',
    version: 1,
  },
  {
    uuid: 'villa-002',
    name: 'Villa 2',
    code: 'V2',
    description: 'Second premium villa complex',
    version: 1,
  },
  {
    uuid: 'villa-003',
    name: 'Villa 3',
    code: 'V3',
    description: 'Third exclusive villa complex',
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

const filterVillaClass = (search: string) => {
  if (!search) return villaClassDb;

  return villaClassDb.filter((item) => {
    return (
      item.name.toLowerCase().includes(search) ||
      item.code.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    );
  });
};

export const handleVillaClassMock = ({
  path,
  queryParams,
  method,
}: MockRequestContext): MockResult => {
  if ((path === '/room/category' || path === '/villa/admin') && method === 'GET') {
    const { page, perPage } = parsePagingParams(queryParams);
    const search = (queryParams.get('search_param') || '').toLowerCase();
    const filtered = filterVillaClass(search);
    const result = paginate(filtered, page, perPage);

    return {
      data: result.data,
      success: true,
      message: 'Success',
      pagination: result.pagination,
    };
  }

  const detailMatch = path.match(/^\/room\/category\/([^/]+)$/u);
  if (detailMatch && method === 'GET') {
    const villaClass = villaClassDb.find((item) => item.uuid === detailMatch[1]);
    return createSuccessResponse(villaClass || null);
  }

  return undefined;
};

