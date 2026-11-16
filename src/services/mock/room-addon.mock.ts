import { createSuccessResponse } from './common';
import { MockRequestContext, MockResult } from './types';

interface RoomAddonRecord {
  uuid: string;
  name: string;
  code: string;
  description: string;
  version: number;
}

const roomAddonDb: RoomAddonRecord[] = [
  {
    uuid: 'ra-001',
    name: 'Extra Breakfast',
    code: 'BFAST',
    description: 'Additional breakfast buffet',
    version: 1,
  },
  {
    uuid: 'ra-002',
    name: 'Airport Transfer',
    code: 'TRANSFER',
    description: 'Pick up or drop off from airport',
    version: 1,
  },
  {
    uuid: 'ra-003',
    name: 'Spa Package',
    code: 'SPA',
    description: '1 hour relaxing spa treatment',
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

const filterRoomAddon = (search: string) => {
  if (!search) return roomAddonDb;

  return roomAddonDb.filter((item) => {
    return (
      item.name.toLowerCase().includes(search) ||
      item.code.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    );
  });
};

export const handleRoomAddonMock = ({ path, queryParams, method }: MockRequestContext): MockResult => {
  if (path === '/master-data/addon' && method === 'GET') {
    const { page, perPage } = parsePagingParams(queryParams);
    const search = (queryParams.get('search_param') || '').toLowerCase();
    const filtered = filterRoomAddon(search);
    const result = paginate(filtered, page, perPage);

    return {
      data: result.data,
      success: true,
      message: 'Success',
      pagination: result.pagination,
    };
  }

  const detailMatch = path.match(/^\/master-data\/addon\/([^/]+)$/u);
  if (detailMatch && method === 'GET') {
    const addon = roomAddonDb.find((item) => item.uuid === detailMatch[1]);
    return createSuccessResponse(addon || null);
  }

  return undefined;
};
