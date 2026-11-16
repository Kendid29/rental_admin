import { createSuccessResponse } from './common';
import { MockRequestContext, MockResult } from './types';
import { RoomTypeType } from '@/lib/types/room-type.type';

const roomTypeDb: RoomTypeType[] = [
  // Villa 1
  {
    uuid: 'rt-101',
    name: 'Room 1',
    code: 'V1-R1',
    description: 'First room in Villa 1',
    bed_type: 'King',
    total_bed: 1,
    occupancy: 2,
    bath_type: 'Bathtub',
    room_category: { uuid: 'villa-001', name: 'Villa 1' },
    room_size: '50 sqm',
    actual_quantity: 5,
    system_use_quantity: 5,
    other_use_quantity: 0,
    is_published_cms: true,
    room_type_has_facilities: [],
    room_type_has_on_request_facilities: [],
    room_type_images: [],
    version: 1,
  },
  {
    uuid: 'rt-102',
    name: 'Room 2',
    code: 'V1-R2',
    description: 'Second room in Villa 1',
    bed_type: 'Twin',
    total_bed: 2,
    occupancy: 2,
    bath_type: 'Shower',
    room_category: { uuid: 'villa-001', name: 'Villa 1' },
    room_size: '45 sqm',
    actual_quantity: 5,
    system_use_quantity: 5,
    other_use_quantity: 0,
    is_published_cms: true,
    room_type_has_facilities: [],
    room_type_has_on_request_facilities: [],
    room_type_images: [],
    version: 1,
  },
  {
    uuid: 'rt-103',
    name: 'Room 3',
    code: 'V1-R3',
    description: 'Third room in Villa 1',
    bed_type: 'King',
    total_bed: 1,
    occupancy: 2,
    bath_type: 'Bathtub',
    room_category: { uuid: 'villa-001', name: 'Villa 1' },
    room_size: '55 sqm',
    actual_quantity: 5,
    system_use_quantity: 5,
    other_use_quantity: 0,
    is_published_cms: true,
    room_type_has_facilities: [],
    room_type_has_on_request_facilities: [],
    room_type_images: [],
    version: 1,
  },
  // Villa 2
  {
    uuid: 'rt-201',
    name: 'Room 1',
    code: 'V2-R1',
    description: 'First room in Villa 2',
    bed_type: 'King',
    total_bed: 1,
    occupancy: 2,
    bath_type: 'Shower',
    room_category: { uuid: 'villa-002', name: 'Villa 2' },
    room_size: '40 sqm',
    actual_quantity: 5,
    system_use_quantity: 5,
    other_use_quantity: 0,
    is_published_cms: true,
    room_type_has_facilities: [],
    room_type_has_on_request_facilities: [],
    room_type_images: [],
    version: 1,
  },
  {
    uuid: 'rt-202',
    name: 'Room 2',
    code: 'V2-R2',
    description: 'Second room in Villa 2',
    bed_type: 'Twin',
    total_bed: 2,
    occupancy: 2,
    bath_type: 'Shower',
    room_category: { uuid: 'villa-002', name: 'Villa 2' },
    room_size: '40 sqm',
    actual_quantity: 5,
    system_use_quantity: 5,
    other_use_quantity: 0,
    is_published_cms: true,
    room_type_has_facilities: [],
    room_type_has_on_request_facilities: [],
    room_type_images: [],
    version: 1,
  },
  {
    uuid: 'rt-203',
    name: 'Room 3',
    code: 'V2-R3',
    description: 'Third room in Villa 2',
    bed_type: 'King',
    total_bed: 1,
    occupancy: 2,
    bath_type: 'Bathtub',
    room_category: { uuid: 'villa-002', name: 'Villa 2' },
    room_size: '48 sqm',
    actual_quantity: 5,
    system_use_quantity: 5,
    other_use_quantity: 0,
    is_published_cms: true,
    room_type_has_facilities: [],
    room_type_has_on_request_facilities: [],
    room_type_images: [],
    version: 1,
  },
  // Villa 3
  {
    uuid: 'rt-301',
    name: 'Room 1',
    code: 'V3-R1',
    description: 'First room in Villa 3',
    bed_type: 'King',
    total_bed: 1,
    occupancy: 2,
    bath_type: 'Bathtub',
    room_category: { uuid: 'villa-003', name: 'Villa 3' },
    room_size: '60 sqm',
    actual_quantity: 3,
    system_use_quantity: 3,
    other_use_quantity: 0,
    is_published_cms: true,
    room_type_has_facilities: [],
    room_type_has_on_request_facilities: [],
    room_type_images: [],
    version: 1,
  },
  {
    uuid: 'rt-302',
    name: 'Room 2',
    code: 'V3-R2',
    description: 'Second room in Villa 3',
    bed_type: 'King',
    total_bed: 1,
    occupancy: 2,
    bath_type: 'Bathtub',
    room_category: { uuid: 'villa-003', name: 'Villa 3' },
    room_size: '65 sqm',
    actual_quantity: 3,
    system_use_quantity: 3,
    other_use_quantity: 0,
    is_published_cms: true,
    room_type_has_facilities: [],
    room_type_has_on_request_facilities: [],
    room_type_images: [],
    version: 1,
  },
  {
    uuid: 'rt-303',
    name: 'Room 3',
    code: 'V3-R3',
    description: 'Third room in Villa 3',
    bed_type: 'King',
    total_bed: 1,
    occupancy: 2,
    bath_type: 'Bathtub',
    room_category: { uuid: 'villa-003', name: 'Villa 3' },
    room_size: '70 sqm',
    actual_quantity: 2,
    system_use_quantity: 2,
    other_use_quantity: 0,
    is_published_cms: true,
    room_type_has_facilities: [],
    room_type_has_on_request_facilities: [],
    room_type_images: [],
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

const filterRoomType = (search: string) => {
  if (!search) return roomTypeDb;

  return roomTypeDb.filter((item) => {
    return (
      item.name.toLowerCase().includes(search) ||
      item.code.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    );
  });
};

export const handleRoomTypeMock = ({
  path,
  queryParams,
  method,
}: MockRequestContext): MockResult => {
  if (path === '/room/type' && method === 'GET') {
    const { page, perPage } = parsePagingParams(queryParams);
    const search = (queryParams.get('search_param') || '').toLowerCase();
    const filtered = filterRoomType(search);
    const result = paginate(filtered, page, perPage);

    return {
      data: result.data,
      success: true,
      message: 'Success',
      pagination: result.pagination,
    };
  }

  const detailMatch = path.match(/^\/room\/type\/([^/]+)$/u);
  if (detailMatch && method === 'GET') {
    const roomType = roomTypeDb.find((item) => item.uuid === detailMatch[1]);
    return createSuccessResponse(roomType || null);
  }

  return undefined;
};

