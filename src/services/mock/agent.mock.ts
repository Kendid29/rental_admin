import { MitraType } from '@/lib/types/mitra.type';

import { createSuccessResponse } from './common';
import { loadFromStorage, saveToStorage } from './storage';
import { MockRequestContext, MockResult } from './types';

const defaultMitras: MitraType[] = [
  {
    uuid: 'mitra-001',
    name: 'Berkah Rental Mobil Bandung',
    email: 'kontak@berkahrental.co.id',
    phone_number: '+628122334455',
    address: 'Jl. Ir. H. Juanda No. 120, Dago',
    city: 'Bandung',
    company: 'PT Berkah Rental Nusantara',
    cooperation_status: 'aktif',
    bank_name: 'BCA',
    bank_account_number: '1234567890',
    bank_account_holder: 'PT Berkah Rental Nusantara',
    version: 1,
    units: [
      {
        uuid: 'unit-001',
        name: 'Toyota Avanza 1.5 G CVT',
        category: 'Mobil',
        plate_number: 'D 1452 ABC',
        status: 'tersedia',
        price_per_day: 350000,
      },
      {
        uuid: 'unit-002',
        name: 'Honda Brio RS 2023',
        category: 'Mobil',
        plate_number: 'D 1899 XYZ',
        status: 'disewa',
        price_per_day: 300000,
      },
      {
        uuid: 'unit-003',
        name: 'Toyota Innova Zenix 2.0 V',
        category: 'Mobil',
        plate_number: 'D 1100 ZZZ',
        status: 'tersedia',
        price_per_day: 650000,
      },
    ],
  },
  {
    uuid: 'mitra-002',
    name: 'Nusantara Trans Jakarta',
    email: 'ops@nusantaratrans.com',
    phone_number: '+6281399887766',
    address: 'Jl. TB Simatupang No. 45, Cilandak',
    city: 'Jakarta',
    company: 'CV Nusantara Transindo',
    cooperation_status: 'aktif',
    bank_name: 'Mandiri',
    bank_account_number: '1370012345678',
    bank_account_holder: 'CV Nusantara Transindo',
    version: 1,
    units: [
      {
        uuid: 'unit-004',
        name: 'Mitsubishi Pajero Sport Dakar 4x2',
        category: 'Mobil',
        plate_number: 'B 1234 SSB',
        status: 'tersedia',
        price_per_day: 950000,
      },
      {
        uuid: 'unit-005',
        name: 'Hyundai Stargazer Prime',
        category: 'Mobil',
        plate_number: 'B 5678 RFS',
        status: 'disewa',
        price_per_day: 400000,
      },
      {
        uuid: 'unit-006',
        name: 'Honda PCX 160 ABS',
        category: 'Motor',
        plate_number: 'B 9012 KLL',
        status: 'tersedia',
        price_per_day: 120000,
      },
    ],
  },
  {
    uuid: 'mitra-003',
    name: 'Surabaya Motor Rental',
    email: 'admin@surabayamotor.id',
    phone_number: '+6281566778899',
    address: 'Jl. Raya Darmo No. 88',
    city: 'Surabaya',
    company: 'Surabaya Motor Rental',
    cooperation_status: 'aktif',
    bank_name: 'BRI',
    bank_account_number: '001201004567509',
    bank_account_holder: 'Hendra Gunawan',
    version: 1,
    units: [
      {
        uuid: 'unit-007',
        name: 'Yamaha NMAX 155 Connected',
        category: 'Motor',
        plate_number: 'L 4567 GH',
        status: 'tersedia',
        price_per_day: 110000,
      },
      {
        uuid: 'unit-008',
        name: 'Honda Vario 160 CBS',
        category: 'Motor',
        plate_number: 'L 6789 JK',
        status: 'tersedia',
        price_per_day: 950000,
      },
    ],
  },
  {
    uuid: 'mitra-004',
    name: 'Bali Jaya Abadi Transport',
    email: 'info@balijayaabadi.com',
    phone_number: '+6281788990011',
    address: 'Jl. Sunset Road No. 18, Kuta',
    city: 'Denpasar',
    company: 'PT Bali Jaya Abadi',
    cooperation_status: 'ditangguhkan',
    bank_name: 'BNI',
    bank_account_number: '0891234567',
    bank_account_holder: 'I Made Suartana',
    version: 1,
    units: [
      {
        uuid: 'unit-009',
        name: 'Toyota Hiace Commuter 16 Seat',
        category: 'Mobil',
        plate_number: 'DK 7890 AA',
        status: 'perawatan',
        price_per_day: 1100000,
      },
    ],
  },
  {
    uuid: 'mitra-005',
    name: 'Yogya Adventure Gear',
    email: 'rental@yogyaadventure.id',
    phone_number: '+6281800112233',
    address: 'Jl. Malioboro No. 32',
    city: 'Yogyakarta',
    company: 'Yogya Adventure Gear',
    cooperation_status: 'tidak_aktif',
    bank_name: 'BCA',
    bank_account_number: '4560987654',
    bank_account_holder: 'Agus Wibowo',
    version: 1,
    units: [
      {
        uuid: 'unit-010',
        name: 'Paket Camping Tenda 4 Person + Matras',
        category: 'Barang',
        status: 'tersedia',
        price_per_day: 75000,
      },
    ],
  },
];

const getMitraDb = (): MitraType[] => {
  return loadFromStorage<MitraType[]>('rentaku_mitras', defaultMitras);
};

const saveMitraDb = (data: MitraType[]) => {
  saveToStorage('rentaku_mitras', data);
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

const filterAgent = (items: MitraType[], search: string, status?: string) => {
  let result = items;

  if (status) {
    result = result.filter((item) => item.cooperation_status === status);
  }

  if (search) {
    result = result.filter((item) => {
      return (
        item.name.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search) ||
        item.phone_number.toLowerCase().includes(search) ||
        (item.company && item.company.toLowerCase().includes(search)) ||
        (item.city && item.city.toLowerCase().includes(search)) ||
        (item.address && item.address.toLowerCase().includes(search))
      );
    });
  }

  return result;
};

export const handleAgentMock = ({
  path,
  queryParams,
  method,
  data,
}: MockRequestContext): MockResult => {
  const mitras = getMitraDb();

  if (path === '/agent' && method === 'GET') {
    const { page, perPage } = parsePagingParams(queryParams);
    const search = (queryParams.get('search_param') || '').toLowerCase();
    const status = queryParams.get('status') || queryParams.get('cooperation_status') || '';
    const filtered = filterAgent(mitras, search, status);
    const result = paginate(filtered, page, perPage);

    return {
      data: result.data,
      success: true,
      message: 'Success',
      pagination: result.pagination,
    };
  }

  if (path === '/agent' && method === 'POST') {
    const newMitra: MitraType = {
      uuid: `mitra-${Date.now()}`,
      name: data.name || '',
      email: data.email || '',
      phone_number: data.phone_number || '',
      address: data.address || '',
      city: data.city || '',
      company: data.company || data.name || '',
      cooperation_status: data.cooperation_status || 'aktif',
      bank_name: data.bank_name || 'BCA',
      bank_account_number: data.bank_account_number || '',
      bank_account_holder: data.bank_account_holder || data.name || '',
      units: data.units || [],
      version: 1,
    };

    mitras.unshift(newMitra);
    saveMitraDb(mitras);
    return createSuccessResponse(newMitra, 'Mitra berhasil ditambahkan');
  }

  const detailMatch = path.match(/^\/agent\/([^/]+)$/u);

  if (detailMatch) {
    const uuid = detailMatch[1];
    const index = mitras.findIndex((item) => item.uuid === uuid);

    if (method === 'GET') {
      return createSuccessResponse(index !== -1 ? mitras[index] : null);
    }

    if (method === 'PUT' && index !== -1) {
      mitras[index] = {
        ...mitras[index],
        ...data,
        version: mitras[index].version + 1,
      };
      saveMitraDb(mitras);
      return createSuccessResponse(mitras[index], 'Mitra berhasil diperbarui');
    }

    if (method === 'DELETE' && index !== -1) {
      mitras.splice(index, 1);
      saveMitraDb(mitras);
      return createSuccessResponse(null, 'Mitra berhasil dihapus');
    }
  }

  return undefined;
};
