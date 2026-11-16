import { MockRequestContext, MockResult } from './types';

interface BookingReportRecord {
  uuid: string;
  booking_number: string;
  guest_name: string;
  booking_time: string;
  check_in: string;
  check_out: string;
  duration: number;
  currency: string;
  status: string;
  total_add_ons_price: number;
  total_rooms_price: number;
  grand_total: string;
  room_details: {
    rome_rate_plan: string;
    addon_details: string;
    total_discount: number;
  };
}

interface PaymentReportRecord {
  booking_number: string;
  payment_number: string;
  name: string;
  check_in: string;
  number_rooms: number;
  currency: string;
  invoice_amount: number;
  total: number;
  total_fee: number;
}

const bookingReportDb: BookingReportRecord[] = [
  {
    uuid: 'br-001',
    booking_number: 'BK-202604-001',
    guest_name: 'Rina Kartika',
    booking_time: '2026-04-15 08:10:00',
    check_in: '2026-04-22',
    check_out: '2026-04-24',
    duration: 2,
    currency: 'IDR',
    status: 'confirmed',
    total_add_ons_price: 100000,
    total_rooms_price: 1450000,
    grand_total: '1450000.00',
    room_details: {
      rome_rate_plan: 'Deluxe Room',
      addon_details: 'Breakfast',
      total_discount: 100000,
    },
  },
  {
    uuid: 'br-002',
    booking_number: 'BK-202604-002',
    guest_name: 'Andi Prasetyo',
    booking_time: '2026-04-10 09:25:00',
    check_in: '2026-04-22',
    check_out: '2026-04-23',
    duration: 1,
    currency: 'IDR',
    status: 'checked_in',
    total_add_ons_price: 0,
    total_rooms_price: 890000,
    grand_total: '890000.00',
    room_details: {
      rome_rate_plan: 'Suite Room',
      addon_details: '-',
      total_discount: 0,
    },
  },
  {
    uuid: 'br-003',
    booking_number: 'BK-202604-003',
    guest_name: 'Maya Lestari',
    booking_time: '2026-04-05 07:00:00',
    check_in: '2026-04-21',
    check_out: '2026-04-22',
    duration: 1,
    currency: 'IDR',
    status: 'completed',
    total_add_ons_price: 0,
    total_rooms_price: 700000,
    grand_total: '650000.00',
    room_details: {
      rome_rate_plan: 'Superior Room',
      addon_details: '-',
      total_discount: 50000,
    },
  },
  {
    uuid: 'br-004',
    booking_number: 'BK-202604-004',
    guest_name: 'Budi Santoso',
    booking_time: '2026-04-18 11:10:00',
    check_in: '2026-04-23',
    check_out: '2026-04-25',
    duration: 2,
    currency: 'IDR',
    status: 'pending',
    total_add_ons_price: 0,
    total_rooms_price: 1200000,
    grand_total: '1200000.00',
    room_details: {
      rome_rate_plan: 'Deluxe Room',
      addon_details: '-',
      total_discount: 0,
    },
  },
  {
    uuid: 'br-005',
    booking_number: 'BK-202604-005',
    guest_name: 'Dewi Anggraini',
    booking_time: '2026-04-02 08:55:00',
    check_in: '2026-04-20',
    check_out: '2026-04-21',
    duration: 1,
    currency: 'IDR',
    status: 'cancelled',
    total_add_ons_price: 0,
    total_rooms_price: 600000,
    grand_total: '560000.00',
    room_details: {
      rome_rate_plan: 'Standard Room',
      addon_details: '-',
      total_discount: 40000,
    },
  },
];

const paymentReportDb: PaymentReportRecord[] = [
  {
    booking_number: 'BK-202604-001',
    payment_number: 'PMT-001',
    name: 'Rina Kartika',
    check_in: '2026-04-22T00:00:00Z',
    number_rooms: 1,
    currency: 'IDR',
    invoice_amount: 1450000,
    total: 1450000,
    total_fee: 5000,
  },
  {
    booking_number: 'BK-202604-002',
    payment_number: 'PMT-002',
    name: 'Andi Prasetyo',
    check_in: '2026-04-22T00:00:00Z',
    number_rooms: 1,
    currency: 'IDR',
    invoice_amount: 890000,
    total: 890000,
    total_fee: 4000,
  },
  {
    booking_number: 'BK-202604-003',
    payment_number: 'PMT-003',
    name: 'Maya Lestari',
    check_in: '2026-04-21T00:00:00Z',
    number_rooms: 1,
    currency: 'IDR',
    invoice_amount: 650000,
    total: 650000,
    total_fee: 3000,
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

const paginate = <T>(items: T[], page: number, perPage: number) => {
  const start = (Math.max(page, 1) - 1) * Math.max(perPage, 1);
  const end = start + Math.max(perPage, 1);

  return {
    data: items.slice(start, end),
    pagination: createPagination(page, perPage, items.length),
  };
};

const parsePagingParams = (queryParams: URLSearchParams) => {
  return {
    page: Number(queryParams.get('page') || '1'),
    perPage: Number(queryParams.get('per_page') || '10'),
  };
};

const handleBookingReport = (queryParams: URLSearchParams) => {
  const search = (queryParams.get('search_param') || '').toLowerCase();
  const status = (queryParams.get('status') || '').toLowerCase();
  const { page, perPage } = parsePagingParams(queryParams);

  const filtered = bookingReportDb.filter((row) => {
    const searchMatch = search
      ? row.booking_number.toLowerCase().includes(search) || row.guest_name.toLowerCase().includes(search)
      : true;
    const statusMatch = status ? row.status.toLowerCase() === status : true;

    return searchMatch && statusMatch;
  });

  return paginate(filtered, page, perPage);
};

const handlePaymentReport = (queryParams: URLSearchParams) => {
  const search = (queryParams.get('search_param') || '').toLowerCase();
  const { page, perPage } = parsePagingParams(queryParams);

  const filtered = paymentReportDb.filter((row) => {
    return search
      ? row.booking_number.toLowerCase().includes(search) || row.name.toLowerCase().includes(search)
      : true;
  });

  return paginate(filtered, page, perPage);
};

export const handleReportsMock = ({ path, queryParams, method }: MockRequestContext): MockResult => {
  if (path === '/report/list/booking' && method === 'GET') {
    const result = handleBookingReport(queryParams);
    return {
      data: result.data,
      success: true,
      message: 'Success',
      pagination: result.pagination,
    };
  }

  if (path === '/report/list/payment' && method === 'GET') {
    const result = handlePaymentReport(queryParams);
    return {
      data: result.data,
      success: true,
      message: 'Success',
      pagination: result.pagination,
    };
  }

  return undefined;
};
