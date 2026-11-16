import { createSuccessResponse } from './common';
import { MockRequestContext, MockResult } from './types';

interface RoomFacilityRecord {
  uuid: string;
  name: string;
  code: string;
  description: string;
  version: number;
  icon_title: string;
}

const roomFacilityDb: RoomFacilityRecord[] = [
  {
    uuid: 'rf-001',
    name: 'Air Conditioning',
    code: 'AC',
    description: 'Centralized air conditioning',
    version: 1,
    icon_title: 'wind',
  },
  {
    uuid: 'rf-002',
    name: 'Free Wi-Fi',
    code: 'WIFI',
    description: 'High-speed internet access',
    version: 1,
    icon_title: 'wifi',
  },
  {
    uuid: 'rf-003',
    name: 'Smart TV',
    code: 'TV',
    description: '55-inch Smart TV with Netflix',
    version: 1,
    icon_title: 'tv',
  },
  {
    uuid: 'rf-004',
    name: 'Mini Bar',
    code: 'MINIBAR',
    description: 'Fully stocked mini bar',
    version: 1,
    icon_title: 'wine',
  },
  {
    uuid: 'rf-005',
    name: 'Private Pool',
    code: 'POOL',
    description: 'Private swimming pool',
    version: 1,
    icon_title: 'waves',
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

const filterRoomFacility = (search: string) => {
  if (!search) return roomFacilityDb;

  return roomFacilityDb.filter((item) => {
    return (
      item.name.toLowerCase().includes(search) ||
      item.code.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    );
  });
};

export const handleRoomFacilitiesMock = ({ path, queryParams, method }: MockRequestContext): MockResult => {
  if (path === '/room/facility' && method === 'GET') {
    const { page, perPage } = parsePagingParams(queryParams);
    const search = (queryParams.get('search_param') || '').toLowerCase();
    const filtered = filterRoomFacility(search);
    const result = paginate(filtered, page, perPage);

    return {
      data: result.data,
      success: true,
      message: 'Success',
      pagination: result.pagination,
    };
  }

  const detailMatch = path.match(/^\/room\/facility\/([^/]+)$/u);
  if (detailMatch && method === 'GET') {
    const facility = roomFacilityDb.find((item) => item.uuid === detailMatch[1]);
    return createSuccessResponse(facility || null);
  }

  return undefined;
};
