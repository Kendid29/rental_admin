import { ActivityLogItem } from '@/lib/types/activity-log.type';

import { createSuccessResponse } from './common';
import { loadFromStorage, saveToStorage } from './storage';
import { MockRequestContext, MockResult } from './types';

const STORAGE_KEY = 'rentaku_activity_logs';

export const SEED_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    uuid: 'log-001',
    action: 'updated',
    module: 'transaksi',
    description: 'Admin mengonfirmasi pembayaran transaksi RNT-2026-0002',
    resource: {
      type: 'transaksi',
      table: 'bookings',
      uuid: 'tx-rentaku-0002',
      label: 'RNT-2026-0002',
    },
    actor: {
      type: 'admin',
      uuid: 'user-001',
      name: 'Super Admin Rentalin Aja',
      email: 'admin@rentaku.id',
    },
    changes: {
      old: { status: 'menunggu_konfirmasi' },
      new: { status: 'terkonfirmasi' },
    },
    request: {
      method: 'PUT',
      path: '/booking/tx-rentaku-0002/confirm',
      ip_address: '180.252.164.21',
      user_agent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/124.0.0.0',
    },
    metadata: {
      model: 'Booking',
      table: 'bookings',
    },
    created_at: '2026-04-18 10:15:22',
    created_at_timestamp: 1776507322,
  },
  {
    uuid: 'log-002',
    action: 'updated',
    module: 'transaksi',
    description: 'Admin meneruskan pesanan sewa RNT-2026-0003 ke mitra Mitra Jaya Rent',
    resource: {
      type: 'transaksi',
      table: 'bookings',
      uuid: 'tx-rentaku-0003',
      label: 'RNT-2026-0003',
    },
    actor: {
      type: 'admin',
      uuid: 'user-001',
      name: 'Super Admin Rentalin Aja',
      email: 'admin@rentaku.id',
    },
    changes: {
      old: { status: 'terkonfirmasi' },
      new: { status: 'diteruskan_mitra' },
    },
    request: {
      method: 'PUT',
      path: '/booking/tx-rentaku-0003/forward',
      ip_address: '180.252.164.21',
      user_agent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/124.0.0.0',
    },
    metadata: {
      model: 'Booking',
      table: 'bookings',
    },
    created_at: '2026-04-17 14:30:10',
    created_at_timestamp: 1776436210,
  },
  {
    uuid: 'log-003',
    action: 'updated',
    module: 'reimburse',
    description:
      'Admin menandai pembayaran reimburse sudah dibayar ke mitra PT Berkah Rental Nusantara',
    resource: {
      type: 'reimburse',
      table: 'reimburses',
      uuid: 'rem-rentaku-002',
      label: 'TRX-BCA-889120938',
    },
    actor: {
      type: 'admin',
      uuid: 'user-003',
      name: 'Dewi Anggraeni',
      email: 'dewi.finance@rentaku.id',
    },
    changes: {
      old: { status: 'belum_dibayar', payment_date: null },
      new: {
        status: 'sudah_dibayar',
        payment_date: '2026-04-11T10:30:00Z',
        transfer_reference: 'TRX-BCA-889120938',
      },
    },
    request: {
      method: 'POST',
      path: '/reimburse/rem-rentaku-002/pay',
      ip_address: '103.111.201.55',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/123.0.0.0',
    },
    metadata: {
      model: 'Reimburse',
      table: 'reimburses',
    },
    created_at: '2026-04-11 10:32:00',
    created_at_timestamp: 1775899920,
  },
  {
    uuid: 'log-004',
    action: 'created',
    module: 'vehicle_category',
    description: 'Admin menambahkan subkategori baru: Motor Listrik',
    resource: {
      type: 'vehicle_category',
      table: 'vehicle_categories',
      uuid: 'cat-003',
      label: 'Motor Listrik',
    },
    actor: {
      type: 'admin',
      uuid: 'user-001',
      name: 'Super Admin Rentalin Aja',
      email: 'admin@rentaku.id',
    },
    changes: {
      old: null,
      new: { name: 'Motor Listrik', parent_id: 'cat-motor', is_active: true },
    },
    request: {
      method: 'POST',
      path: '/vehicle-category',
      ip_address: '180.252.164.21',
      user_agent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/124.0.0.0',
    },
    metadata: {
      model: 'VehicleCategory',
      table: 'vehicle_categories',
    },
    created_at: '2026-04-10 16:20:45',
    created_at_timestamp: 1775838045,
  },
  {
    uuid: 'log-005',
    action: 'updated',
    module: 'mitra',
    description: 'Pembaruan data rekening bank mitra Bali Motor Rent',
    resource: {
      type: 'mitra',
      table: 'agents',
      uuid: 'agent-3',
      label: 'Bali Motor Rent',
    },
    actor: {
      type: 'admin',
      uuid: 'user-002',
      name: 'Budi Santoso',
      email: 'budi.ops@rentaku.id',
    },
    changes: {
      old: { bank_name: 'BCA', bank_account_number: '1234567890' },
      new: { bank_name: 'BNI', bank_account_number: '0891234567' },
    },
    request: {
      method: 'PUT',
      path: '/agent/agent-3',
      ip_address: '114.125.45.89',
      user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    },
    metadata: {
      model: 'Agent',
      table: 'agents',
    },
    created_at: '2026-04-09 11:05:12',
    created_at_timestamp: 1775732712,
  },
  {
    uuid: 'log-006',
    action: 'updated',
    module: 'admin',
    description: 'Admin mengubah status akun staf Hendra Wijaya menjadi tidak aktif',
    resource: {
      type: 'admin',
      table: 'users',
      uuid: 'user-004',
      label: 'Hendra Wijaya',
    },
    actor: {
      type: 'admin',
      uuid: 'user-001',
      name: 'Super Admin Rentalin Aja',
      email: 'admin@rentaku.id',
    },
    changes: {
      old: { status: 'aktif' },
      new: { status: 'tidak_aktif' },
    },
    request: {
      method: 'PUT',
      path: '/auth/employee/user-004',
      ip_address: '180.252.164.21',
      user_agent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/124.0.0.0',
    },
    metadata: {
      model: 'User',
      table: 'users',
    },
    created_at: '2026-04-08 09:40:00',
    created_at_timestamp: 1775641200,
  },
];

export const getActivityLogDb = (): ActivityLogItem[] => {
  return loadFromStorage<ActivityLogItem[]>(STORAGE_KEY, SEED_ACTIVITY_LOGS);
};

export const saveActivityLogDb = (data: ActivityLogItem[]): void => {
  saveToStorage(STORAGE_KEY, data);
};

const paginate = <T>(items: T[], page: number, perPage: number) => {
  const start = (Math.max(page, 1) - 1) * Math.max(perPage, 1);
  const end = start + Math.max(perPage, 1);
  const totalData = items.length;
  const totalPage = Math.ceil(totalData / Math.max(perPage, 1)) || 1;

  return {
    data: items.slice(start, end),
    pagination: {
      data_per_page: perPage,
      next_page: page < totalPage ? page + 1 : page,
      prev_page: page > 1 ? page - 1 : 1,
      first_page: 1,
      last_page: totalPage,
      next_page_url: '',
      previous_page_url: '',
      first_page_url: '',
      last_page_url: '',
      total_page: totalPage,
      total_data: totalData,
    },
  };
};

export const handleActivityLogMock = ({
  path,
  queryParams,
  method,
}: MockRequestContext): MockResult => {
  // Detail: GET /activity-log/:uuid
  const detailMatch = path.match(/^\/activity-log\/([^/]+)$/u);

  if (detailMatch && method === 'GET') {
    const uuid = detailMatch[1];
    const logs = getActivityLogDb();
    const item = logs.find((l) => l.uuid === uuid);

    if (!item) {
      return {
        data: null,
        success: false,
        message: 'Log tidak ditemukan',
      };
    }

    return createSuccessResponse(item);
  }

  // List: GET /activity-log
  if (path === '/activity-log' && method === 'GET') {
    const logs = getActivityLogDb();
    const search = (
      queryParams.get('search_param') ||
      queryParams.get('search') ||
      queryParams.get('keyword')
    )?.toLowerCase();
    const action = queryParams.get('action');
    const moduleFilter = queryParams.get('module');

    let filtered = [...logs];

    if (search) {
      filtered = filtered.filter(
        (l) =>
          l.description?.toLowerCase().includes(search) ||
          l.module?.toLowerCase().includes(search) ||
          l.actor?.name?.toLowerCase().includes(search) ||
          l.actor?.email?.toLowerCase().includes(search) ||
          l.resource?.label?.toLowerCase().includes(search) ||
          l.request?.ip_address?.toLowerCase().includes(search),
      );
    }

    if (action && action !== 'all') {
      filtered = filtered.filter((l) => l.action.toLowerCase() === action.toLowerCase());
    }

    if (moduleFilter && moduleFilter !== 'all') {
      filtered = filtered.filter((l) => l.module.toLowerCase() === moduleFilter.toLowerCase());
    }

    // Sort by created_at_timestamp descending
    filtered.sort((a, b) => b.created_at_timestamp - a.created_at_timestamp);

    const page = parseInt(queryParams.get('page') || '1', 10);
    const perPage = parseInt(queryParams.get('per_page') || '10', 10);

    const result = paginate(filtered, page, perPage);

    return {
      data: result.data,
      success: true,
      message: 'Success',
      pagination: result.pagination,
    };
  }

  return undefined;
};
