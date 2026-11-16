import { ReimburseType } from '@/lib/types/reimburse.type';

import { createSuccessResponse } from './common';
import { loadFromStorage, saveToStorage } from './storage';
import { MockRequestContext, MockResult } from './types';

const STORAGE_KEY = 'rentaku_reimburses';

export const SEED_REIMBURSES: ReimburseType[] = [
  {
    uuid: 'rem-rentaku-001',
    transaksi_uuid: 'tx-rentaku-0007',
    booking_number: 'RNT-2026-0007',
    mitra: {
      uuid: 'agent-1',
      name: 'Budi Santoso',
      company: 'PT Berkah Rental Nusantara',
      city: 'Jakarta Selatan',
      phone_number: '+628122334455',
      bank_name: 'BCA',
      bank_account_number: '1234567890',
      bank_account_holder: 'PT Berkah Rental Nusantara',
    },
    unit: {
      uuid: 'unit-1',
      name: 'Honda HR-V 2024',
      category: 'Mobil',
      plate_number: 'B 1010 HR',
    },
    total_transaction: 2100000,
    platform_fee: 210000,
    nominal_reimburse: 1890000,
    status: 'belum_dibayar',
    payment_date: null,
    transfer_proof_url: null,
    transfer_reference: null,
    notes: null,
    created_at: '2026-04-12T16:00:00Z',
  },
  {
    uuid: 'rem-rentaku-002',
    transaksi_uuid: 'tx-rentaku-0008',
    booking_number: 'RNT-2026-0008',
    mitra: {
      uuid: 'agent-2',
      name: 'Agus Wibowo',
      company: 'Mitra Jaya Rent',
      city: 'Surabaya',
      phone_number: '+6281800112233',
      bank_name: 'BCA',
      bank_account_number: '4560987654',
      bank_account_holder: 'Agus Wibowo',
    },
    unit: {
      uuid: 'unit-3',
      name: 'Toyota Fortuner GR Sport',
      category: 'Mobil',
      plate_number: 'B 2024 FTR',
    },
    total_transaction: 3600000,
    platform_fee: 360000,
    nominal_reimburse: 3240000,
    status: 'sudah_dibayar',
    payment_date: '2026-04-11T10:30:00Z',
    transfer_proof_url: '/img/rentaku-logo.png',
    transfer_reference: 'TRX-BCA-889120938',
    notes: 'Transfer sukses via KlikBCA Bisnis ke rekening mitra.',
    created_at: '2026-04-10T18:00:00Z',
  },
  {
    uuid: 'rem-rentaku-003',
    transaksi_uuid: 'tx-rentaku-0009',
    booking_number: 'RNT-2026-0009',
    mitra: {
      uuid: 'agent-3',
      name: 'I Made Suartana',
      company: 'Bali Motor Rent',
      city: 'Denpasar',
      phone_number: '+6281788990011',
      bank_name: 'BNI',
      bank_account_number: '0891234567',
      bank_account_holder: 'I Made Suartana',
    },
    unit: {
      uuid: 'unit-4',
      name: 'Yamaha NMAX 155 Connected',
      category: 'Motor',
      plate_number: 'DK 4567 NMX',
    },
    total_transaction: 600000,
    platform_fee: 60000,
    nominal_reimburse: 540000,
    status: 'belum_dibayar',
    payment_date: null,
    transfer_proof_url: null,
    transfer_reference: null,
    notes: null,
    created_at: '2026-04-09T18:00:00Z',
  },
  {
    uuid: 'rem-rentaku-004',
    transaksi_uuid: 'tx-rentaku-0012',
    booking_number: 'RNT-2026-0012',
    mitra: {
      uuid: 'agent-4',
      name: 'Hendra Gunawan',
      company: 'Lintas Rental Bandung',
      city: 'Bandung',
      phone_number: '+6281566778899',
      bank_name: 'BRI',
      bank_account_number: '001201004567509',
      bank_account_holder: 'Hendra Gunawan',
    },
    unit: {
      uuid: 'unit-2',
      name: 'Toyota Avanza Veloz 2023',
      category: 'Mobil',
      plate_number: 'D 1455 VEL',
    },
    total_transaction: 1050000,
    platform_fee: 105000,
    nominal_reimburse: 945000,
    status: 'sudah_dibayar',
    payment_date: '2026-04-07T14:15:00Z',
    transfer_proof_url: '/img/rentaku-logo.png',
    transfer_reference: 'TRX-BRI-330192837',
    notes: 'Reimburse lunas.',
    created_at: '2026-04-06T18:00:00Z',
  },
  {
    uuid: 'rem-rentaku-005',
    transaksi_uuid: 'tx-rentaku-0015',
    booking_number: 'RNT-2026-0015',
    mitra: {
      uuid: 'agent-1',
      name: 'Budi Santoso',
      company: 'PT Berkah Rental Nusantara',
      city: 'Jakarta Selatan',
      phone_number: '+628122334455',
      bank_name: 'BCA',
      bank_account_number: '1234567890',
      bank_account_holder: 'PT Berkah Rental Nusantara',
    },
    unit: {
      uuid: 'unit-5',
      name: 'Sony Alpha A7 IV + Lens 24-70mm',
      category: 'Kamera & Alat Produksi',
      plate_number: 'BARANG-SNY-01',
    },
    total_transaction: 1500000,
    platform_fee: 150000,
    nominal_reimburse: 1350000,
    status: 'belum_dibayar',
    payment_date: null,
    transfer_proof_url: null,
    transfer_reference: null,
    notes: null,
    created_at: '2026-04-14T11:00:00Z',
  },
];

export const getReimburseDb = (): ReimburseType[] => {
  return loadFromStorage<ReimburseType[]>(STORAGE_KEY, SEED_REIMBURSES);
};

export const saveReimburseDb = (data: ReimburseType[]): void => {
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

export const handleReimburseMock = ({
  path,
  queryParams,
  method,
  data,
}: MockRequestContext): MockResult => {
  // 1. Mark as Paid: POST /reimburse/:uuid/pay
  const payMatch = path.match(/^\/reimburse\/([^/]+)\/pay$/u);

  if (payMatch && method === 'POST') {
    const uuid = payMatch[1];
    const reimburses = getReimburseDb();
    const index = reimburses.findIndex((r) => r.uuid === uuid);

    if (index === -1) {
      return {
        data: null,
        success: false,
        message: 'Data reimburse tidak ditemukan',
      };
    }

    const payload = data || {};
    const updated: ReimburseType = {
      ...reimburses[index],
      status: 'sudah_dibayar',
      payment_date: payload.payment_date || new Date().toISOString(),
      transfer_reference: payload.transfer_reference || `TRX-${Date.now()}`,
      transfer_proof_url: payload.transfer_proof_url || '/img/rentaku-logo.png',
      notes: payload.notes || 'Pembayaran reimburse ke rekening mitra berhasil dicatat.',
    };

    reimburses[index] = updated;
    saveReimburseDb(reimburses);

    // Sync status to booking in rentaku_transaksi
    try {
      const bookingsRaw =
        typeof window !== 'undefined' ? window.localStorage.getItem('rentaku_transaksi') : null;

      if (bookingsRaw) {
        const bookings = JSON.parse(bookingsRaw);
        const bIdx = bookings.findIndex(
          (b: any) =>
            b.uuid === updated.transaksi_uuid || b.booking_number === updated.booking_number,
        );

        if (bIdx !== -1) {
          bookings[bIdx].reimburse_status = 'sudah_dibayar';
          window.localStorage.setItem('rentaku_transaksi', JSON.stringify(bookings));
        }
      }
    } catch {
      // ignore
    }

    return createSuccessResponse(updated, 'Reimburse berhasil ditandai sudah dibayar');
  }

  // 2. Get Detail: GET /reimburse/:uuid
  const detailMatch = path.match(/^\/reimburse\/([^/]+)$/u);

  if (detailMatch && method === 'GET') {
    const uuid = detailMatch[1];
    const reimburses = getReimburseDb();
    const item = reimburses.find((r) => r.uuid === uuid);

    if (!item) {
      return {
        data: null,
        success: false,
        message: 'Data reimburse tidak ditemukan',
      };
    }

    return createSuccessResponse(item);
  }

  // 3. List Reimburse: GET /reimburse
  if (path === '/reimburse' && method === 'GET') {
    const reimburses = getReimburseDb();
    const search = (queryParams.get('search') || queryParams.get('keyword'))?.toLowerCase();
    const status = queryParams.get('status');

    let filtered = [...reimburses];

    if (search) {
      filtered = filtered.filter(
        (r) =>
          r.booking_number?.toLowerCase().includes(search) ||
          r.mitra?.name?.toLowerCase().includes(search) ||
          r.mitra?.company?.toLowerCase().includes(search) ||
          r.unit?.name?.toLowerCase().includes(search),
      );
    }

    if (status && status !== 'all' && status !== 'semua') {
      filtered = filtered.filter((r) => r.status === status);
    }

    // Sort by created_at descending
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const page = parseInt(queryParams.get('page') || '1', 10);
    const pageSize = parseInt(
      queryParams.get('page_size') || queryParams.get('per_page') || '10',
      10,
    );

    const result = paginate(filtered, page, pageSize);

    return {
      data: result.data,
      success: true,
      message: 'Success',
      pagination: result.pagination,
    };
  }

  return undefined;
};
