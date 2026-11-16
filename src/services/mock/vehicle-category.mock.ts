import { VehicleCategoryType } from '@/lib/types/vehicle-category.type';

import { createSuccessResponse } from './common';
import { loadFromStorage, saveToStorage } from './storage';
import { MockRequestContext, MockResult } from './types';

const defaultCategories: VehicleCategoryType[] = [
  {
    uuid: 'cat-001',
    name: 'MPV / Mobil Keluarga',
    code: 'mobil_mpv',
    type: 'mobil',
    description: 'Kendaraan keluarga berkapasitas 7 penumpang untuk perjalanan nyaman dan luas.',
    unit_count: 5,
    version: 1,
    created_at: '2026-01-10T08:00:00Z',
    updated_at: '2026-03-15T09:00:00Z',
  },
  {
    uuid: 'cat-002',
    name: 'City Car / Hatchback',
    code: 'mobil_citycar',
    type: 'mobil',
    description: 'Mobil kompak lincah dan hemat bahan bakar untuk mobilitas perkotaan.',
    unit_count: 4,
    version: 1,
    created_at: '2026-01-12T08:00:00Z',
    updated_at: '2026-03-12T10:00:00Z',
  },
  {
    uuid: 'cat-003',
    name: 'SUV / Off-Road',
    code: 'mobil_suv',
    type: 'mobil',
    description: 'Mobil tangguh bertenaga tinggi untuk berbagai medan jalan dan perjalanan jauh.',
    unit_count: 3,
    version: 1,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-02-20T11:00:00Z',
  },
  {
    uuid: 'cat-004',
    name: 'Minibus & Van',
    code: 'mobil_minibus',
    type: 'mobil',
    description: 'Kendaraan rombongan kapasitas 12-16 penumpang (Toyota Hiace / Isuzu Elf).',
    unit_count: 2,
    version: 1,
    created_at: '2026-01-20T08:00:00Z',
    updated_at: '2026-03-01T14:00:00Z',
  },
  {
    uuid: 'cat-005',
    name: 'Motor Matic Premium',
    code: 'motor_matic_premium',
    type: 'motor',
    description: 'Skuter matik 150cc-250cc (NMAX, PCX, XMAX) nyaman dan elegan.',
    unit_count: 6,
    version: 1,
    created_at: '2026-02-01T08:00:00Z',
    updated_at: '2026-04-01T08:00:00Z',
  },
  {
    uuid: 'cat-006',
    name: 'Motor Komuter / Harian',
    code: 'motor_komuter',
    type: 'motor',
    description: 'Motor bebek dan matik standar (Vario, Beat, Scoopy) irit dan gesit.',
    unit_count: 4,
    version: 1,
    created_at: '2026-02-05T08:00:00Z',
    updated_at: '2026-03-18T16:00:00Z',
  },
  {
    uuid: 'cat-007',
    name: 'Perlengkapan Camping & Outdoor',
    code: 'barang_outdoor',
    type: 'barang',
    description: 'Tenda dome, matras angin, sleeping bag, dan kompor portable.',
    unit_count: 5,
    version: 1,
    created_at: '2026-02-10T08:00:00Z',
    updated_at: '2026-04-10T12:00:00Z',
  },
];

const getCategoryDb = (): VehicleCategoryType[] => {
  return loadFromStorage<VehicleCategoryType[]>('rentaku_vehicle_categories', defaultCategories);
};

const saveCategoryDb = (data: VehicleCategoryType[]) => {
  saveToStorage('rentaku_vehicle_categories', data);
};

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

const filterCategories = (items: VehicleCategoryType[], search: string, type?: string) => {
  let result = items;

  if (type) {
    result = result.filter((item) => item.type === type);
  }

  if (search) {
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        (item.description && item.description.toLowerCase().includes(search)) ||
        item.code.toLowerCase().includes(search),
    );
  }

  return result;
};

export const handleVehicleCategoryMock = ({
  path,
  queryParams,
  method,
  data,
}: MockRequestContext): MockResult => {
  const categories = getCategoryDb();

  if (path === '/vehicle-category' && method === 'GET') {
    const { page, perPage } = parsePagingParams(queryParams);
    const search = (queryParams.get('search_param') || '').toLowerCase();
    const type = queryParams.get('type') || '';
    const filtered = filterCategories(categories, search, type);
    const result = paginate(filtered, page, perPage);

    return {
      data: result.data,
      success: true,
      message: 'Success',
      pagination: result.pagination,
    };
  }

  if (path === '/vehicle-category' && method === 'POST') {
    const newCategory: VehicleCategoryType = {
      uuid: `cat-${Date.now()}`,
      name: data.name || 'Kategori Baru',
      code: data.code || `cat_${Date.now()}`,
      type: data.type || 'mobil',
      description: data.description || '',
      icon: data.icon || '',
      unit_count: 0,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    categories.unshift(newCategory);
    saveCategoryDb(categories);
    return createSuccessResponse(newCategory, 'Kategori kendaraan berhasil dibuat');
  }

  const detailMatch = path.match(/^\/vehicle-category\/([^/]+)$/u);

  if (detailMatch) {
    const uuid = detailMatch[1];
    const index = categories.findIndex((item) => item.uuid === uuid);

    if (method === 'GET') {
      return createSuccessResponse(index !== -1 ? categories[index] : null);
    }

    if (method === 'PUT' && index !== -1) {
      categories[index] = {
        ...categories[index],
        ...data,
        version: categories[index].version + 1,
        updated_at: new Date().toISOString(),
      };
      saveCategoryDb(categories);
      return createSuccessResponse(categories[index], 'Kategori kendaraan berhasil diperbarui');
    }

    if (method === 'DELETE' && index !== -1) {
      categories.splice(index, 1);
      saveCategoryDb(categories);
      return createSuccessResponse(null, 'Kategori kendaraan berhasil dihapus');
    }
  }

  return undefined;
};
