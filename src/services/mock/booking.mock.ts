import { createSuccessResponse } from './common';
import { MockRequestContext, MockResult } from './types';

type BookingStatusValue = 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled';

interface BookingRecord {
  uuid: string;
  booking_number: string;
  booking_date: string;
  check_in: string;
  check_out: string;
  checked_in_at: string;
  checked_out_at: string;
  duration: number;
  total_payment: number;
  total_discount: number;
  payment_type: string;
  status: {
    label: string;
    value: BookingStatusValue;
  };
  guest_info: {
    name: string;
    email: string;
    phone_number: string;
  };
  guest_count: {
    adults: number;
    children: number;
  };
  membership: {
    uuid: string;
    name: string;
  };
  agent_uuid?: string;
  version: number;
  rooms: Array<{
    uuid: string;
    quantity: number;
    price: number;
    total_price: number;
    room_type: {
      uuid: string;
      name: string;
    };
    addons: Array<{
      uuid: string;
      addon: {
        uuid: string;
        name: string;
      };
      quantity: number;
      price: string;
      total_price: string;
    }>;
    is_cancellable: boolean;
    per_night_promos: Array<{
      date: string;
      original_price: number;
      discount: number;
      selling_price: number;
      applied_promo: {
        uuid: string;
        name: string;
      };
    }>;
  }>;
  package_tours: Array<{
    uuid: string;
    package_tour: {
      uuid: string;
      name: string;
    };
    price: string;
    total_price: string;
    quantity: number;
  }>;
  vouchers: Array<{
    uuid: string;
    discount: string;
    voucher: {
      uuid: string;
      name: string;
    };
  }>;
}

const toStatusLabel = (value: BookingStatusValue) => {
  switch (value) {
    case 'checked_in':
      return 'Checked In';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    case 'confirmed':
      return 'Confirmed';
    case 'pending':
    default:
      return 'Pending';
  }
};

const nowIso = () => new Date().toISOString();

const bookingDb: BookingRecord[] = [
  {
    uuid: 'bk-001',
    booking_number: 'BK-202604-001',
    booking_date: '2026-04-15T08:10:00Z',
    check_in: '2026-04-22',
    check_out: '2026-04-24',
    checked_in_at: '',
    checked_out_at: '',
    duration: 2,
    total_payment: 1350000,
    total_discount: 100000,
    payment_type: 'bank_transfer',
    status: { label: 'Confirmed', value: 'confirmed' },
    guest_info: {
      name: 'Rina Kartika',
      email: 'rina.kartika@mail.com',
      phone_number: '+628111111111',
    },
    guest_count: { adults: 2, children: 1 },
    membership: { uuid: 'mt-gold', name: 'Gold' },
    agent_uuid: 'agent-001',
    version: 1,
    rooms: [
      {
        uuid: 'br-001',
        quantity: 1,
        price: 725000,
        total_price: 1450000,
        room_type: { uuid: 'rt-deluxe', name: 'Deluxe Room' },
        addons: [
          {
            uuid: 'ba-001',
            addon: { uuid: 'ad-breakfast', name: 'Breakfast' },
            quantity: 2,
            price: '50000',
            total_price: '100000',
          },
        ],
        is_cancellable: true,
        per_night_promos: [
          {
            date: '2026-04-22',
            original_price: 725000,
            discount: 50000,
            selling_price: 675000,
            applied_promo: { uuid: 'pr-ramadan', name: 'Ramadan Deal' },
          },
        ],
      },
    ],
    package_tours: [],
    vouchers: [
      {
        uuid: 'bv-001',
        discount: '100000',
        voucher: { uuid: 'vc-001', name: 'DISC100' },
      },
    ],
  },
  {
    uuid: 'bk-002',
    booking_number: 'BK-202604-002',
    booking_date: '2026-04-10T09:25:00Z',
    check_in: '2026-04-22',
    check_out: '2026-04-23',
    checked_in_at: '2026-04-22T05:20:00Z',
    checked_out_at: '',
    duration: 1,
    total_payment: 890000,
    total_discount: 0,
    payment_type: 'credit_card',
    status: { label: 'Checked In', value: 'checked_in' },
    guest_info: {
      name: 'Andi Prasetyo',
      email: 'andi.prasetyo@mail.com',
      phone_number: '+628122222222',
    },
    guest_count: { adults: 2, children: 0 },
    membership: { uuid: 'mt-silver', name: 'Silver' },
    agent_uuid: 'agent-001',
    version: 2,
    rooms: [
      {
        uuid: 'br-002',
        quantity: 1,
        price: 890000,
        total_price: 890000,
        room_type: { uuid: 'rt-suite', name: 'Suite Room' },
        addons: [],
        is_cancellable: false,
        per_night_promos: [],
      },
    ],
    package_tours: [],
    vouchers: [],
  },
  {
    uuid: 'bk-003',
    booking_number: 'BK-202604-003',
    booking_date: '2026-04-05T07:00:00Z',
    check_in: '2026-04-21',
    check_out: '2026-04-22',
    checked_in_at: '2026-04-21T06:00:00Z',
    checked_out_at: '2026-04-22T03:00:00Z',
    duration: 1,
    total_payment: 650000,
    total_discount: 50000,
    payment_type: 'bank_transfer',
    status: { label: 'Completed', value: 'completed' },
    guest_info: {
      name: 'Maya Lestari',
      email: 'maya.lestari@mail.com',
      phone_number: '+628133333333',
    },
    guest_count: { adults: 1, children: 0 },
    membership: { uuid: 'mt-bronze', name: 'Bronze' },
    agent_uuid: 'agent-001',
    version: 3,
    rooms: [
      {
        uuid: 'br-003',
        quantity: 1,
        price: 700000,
        total_price: 700000,
        room_type: { uuid: 'rt-superior', name: 'Superior Room' },
        addons: [],
        is_cancellable: false,
        per_night_promos: [
          {
            date: '2026-04-21',
            original_price: 700000,
            discount: 50000,
            selling_price: 650000,
            applied_promo: { uuid: 'pr-midweek', name: 'Midweek Promo' },
          },
        ],
      },
    ],
    package_tours: [],
    vouchers: [],
  },
  {
    uuid: 'bk-004',
    booking_number: 'BK-202604-004',
    booking_date: '2026-04-18T11:10:00Z',
    check_in: '2026-04-23',
    check_out: '2026-04-25',
    checked_in_at: '',
    checked_out_at: '',
    duration: 2,
    total_payment: 1200000,
    total_discount: 0,
    payment_type: 'bank_transfer',
    status: { label: 'Pending', value: 'pending' },
    guest_info: {
      name: 'Budi Santoso',
      email: 'budi.santoso@mail.com',
      phone_number: '+628144444444',
    },
    guest_count: { adults: 2, children: 0 },
    membership: { uuid: 'mt-none', name: '-' },
    agent_uuid: 'agent-002',
    version: 1,
    rooms: [
      {
        uuid: 'br-004',
        quantity: 1,
        price: 600000,
        total_price: 1200000,
        room_type: { uuid: 'rt-deluxe', name: 'Deluxe Room' },
        addons: [],
        is_cancellable: true,
        per_night_promos: [],
      },
    ],
    package_tours: [],
    vouchers: [],
  },
  {
    uuid: 'bk-005',
    booking_number: 'BK-202604-005',
    booking_date: '2026-04-02T08:55:00Z',
    check_in: '2026-04-20',
    check_out: '2026-04-21',
    checked_in_at: '',
    checked_out_at: '',
    duration: 1,
    total_payment: 560000,
    total_discount: 40000,
    payment_type: 'e_wallet',
    status: { label: 'Cancelled', value: 'cancelled' },
    guest_info: {
      name: 'Dewi Anggraini',
      email: 'dewi.anggraini@mail.com',
      phone_number: '+628155555555',
    },
    guest_count: { adults: 1, children: 1 },
    membership: { uuid: 'mt-none', name: '-' },
    agent_uuid: 'agent-002',
    version: 2,
    rooms: [
      {
        uuid: 'br-005',
        quantity: 1,
        price: 600000,
        total_price: 600000,
        room_type: { uuid: 'rt-standard', name: 'Standard Room' },
        addons: [],
        is_cancellable: false,
        per_night_promos: [
          {
            date: '2026-04-20',
            original_price: 600000,
            discount: 40000,
            selling_price: 560000,
            applied_promo: { uuid: 'pr-flash', name: 'Flash Sale' },
          },
        ],
      },
    ],
    package_tours: [],
    vouchers: [],
  },
  {
    uuid: 'bk-006',
    booking_number: 'BK-202604-006',
    booking_date: '2026-04-20T10:00:00Z',
    check_in: '2026-04-29',
    check_out: '2026-04-30',
    checked_in_at: '',
    checked_out_at: '',
    duration: 1,
    total_payment: 2500000,
    total_discount: 0,
    payment_type: 'bank_transfer',
    status: { label: 'Confirmed', value: 'confirmed' },
    guest_info: {
      name: 'John Doe',
      email: 'john.doe@mail.com',
      phone_number: '+628166666666',
    },
    guest_count: { adults: 2, children: 0 },
    membership: { uuid: 'mt-none', name: '-' },
    agent_uuid: 'agent-002',
    version: 1,
    rooms: [
      {
        uuid: 'br-006',
        quantity: 1,
        price: 1000000,
        total_price: 1000000,
        room_type: { uuid: 'rt-deluxe', name: 'Deluxe Room' },
        addons: [],
        is_cancellable: true,
        per_night_promos: [],
      },
    ],
    package_tours: [
      {
        uuid: 'bpt-001',
        package_tour: {
          uuid: 'tour-001',
          name: 'Island Hopping Adventure',
        },
        price: '1500000',
        total_price: '1500000',
        quantity: 1,
      },
    ],
    vouchers: [],
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

const toListItem = (booking: BookingRecord) => ({
  uuid: booking.uuid,
  booking_number: booking.booking_number,
  booking_date: booking.booking_date,
  status: booking.status,
  check_in: booking.check_in,
  check_out: booking.check_out,
  checked_in_at: booking.checked_in_at,
  checked_out_at: booking.checked_out_at,
  duration: booking.duration,
  total_payment: booking.total_payment,
  total_discount: booking.total_discount,
  guest_info: booking.guest_info,
  guest_count: booking.guest_count,
});

const handleGetBookings = (queryParams: URLSearchParams) => {
  const status = (queryParams.get('status') || '').toLowerCase();
  const checkIn = queryParams.get('check_in') || '';
  const search = (queryParams.get('search_param') || '').toLowerCase();
  const page = Number(queryParams.get('page') || '1');
  const perPage = Number(queryParams.get('per_page') || '10');
  const agentUuid = queryParams.get('agent_uuid') || '';

  const filtered = bookingDb.filter((booking) => {
    if (!agentUuid) {
      const isHistory = booking.status.value === 'completed' || booking.status.value === 'cancelled';
      if (isHistory) return false;
    }

    const agentMatch = agentUuid ? booking.agent_uuid === agentUuid : true;
    const statusMatch = status ? booking.status.value === status : true;
    const dateMatch = checkIn ? booking.check_in === checkIn : true;
    const searchMatch = search
      ? booking.booking_number.toLowerCase().includes(search) ||
        booking.guest_info.name.toLowerCase().includes(search)
      : true;

    return agentMatch && statusMatch && dateMatch && searchMatch;
  });

  const start = (Math.max(page, 1) - 1) * Math.max(perPage, 1);
  const end = start + Math.max(perPage, 1);
  const data = filtered.slice(start, end).map(toListItem);

  return {
    data,
    pagination: createPagination(page, perPage, filtered.length),
  };
};

const handleGetBookingHistory = (queryParams: URLSearchParams) => {
  const status = (queryParams.get('status') || '').toLowerCase();
  const search = (queryParams.get('search_param') || '').toLowerCase();
  const page = Number(queryParams.get('page') || '1');
  const perPage = Number(queryParams.get('per_page') || '10');

  const filtered = bookingDb.filter((booking) => {
    const isHistory = booking.status.value === 'completed' || booking.status.value === 'cancelled';
    if (!isHistory) return false;

    const statusMatch = status ? booking.status.value === status : true;
    const searchMatch = search
      ? booking.booking_number.toLowerCase().includes(search) ||
        booking.guest_info.name.toLowerCase().includes(search)
      : true;

    return statusMatch && searchMatch;
  });

  const start = (Math.max(page, 1) - 1) * Math.max(perPage, 1);
  const end = start + Math.max(perPage, 1);
  const data = filtered.slice(start, end).map(toListItem);

  return {
    data,
    pagination: createPagination(page, perPage, filtered.length),
  };
};

const handleGetBookingCalendar = (queryParams: URLSearchParams) => {
  const dateRange = queryParams.get('date_range') || '';
  const [startDate] = dateRange.split(' to ');
  const [year, month] = (startDate || '2026-04-01').split('-');
  const daysInMonth = new Date(Number(year), Number(month), 0).getDate();

  return Array.from({ length: daysInMonth }, (_, idx) => {
    const day = `${year}-${month}-${String(idx + 1).padStart(2, '0')}`;

    const stats = bookingDb.filter((booking) => booking.check_in === day).reduce(
      (acc, booking) => {
        if (booking.status.value === 'pending') acc.pending += 1;
        if (booking.status.value === 'confirmed') acc.confirmed += 1;
        if (booking.status.value === 'checked_in') acc.checked_in += 1;
        if (booking.status.value === 'completed') acc.completed += 1;
        if (booking.status.value === 'cancelled') acc.cancelled += 1;
        return acc;
      },
      {
        pending: 0,
        confirmed: 0,
        checked_in: 0,
        completed: 0,
        cancelled: 0,
      },
    );

    return {
      date: day,
      total_bookings: stats,
    };
  });
};

const findBookingByPath = (path: string) => {
  const detailMatch = path.match(/^\/booking\/([^/]+)\/detail$/u);
  const checkInMatch = path.match(/^\/booking\/([^/]+)\/check-in$/u);
  const checkOutMatch = path.match(/^\/booking\/([^/]+)\/check-out$/u);
  const cancelMatch = path.match(/^\/booking\/([^/]+)\/cancel$/u);

  return {
    detailUuid: detailMatch?.[1],
    checkInUuid: checkInMatch?.[1],
    checkOutUuid: checkOutMatch?.[1],
    cancelUuid: cancelMatch?.[1],
  };
};

const handleBookingAction = (uuid: string, action: 'check_in' | 'check_out' | 'cancel') => {
  const booking = bookingDb.find((item) => item.uuid === uuid);
  if (!booking) {
    return createSuccessResponse(null, 'Booking not found');
  }

  booking.version += 1;

  if (action === 'check_in') {
    booking.status = { label: toStatusLabel('checked_in'), value: 'checked_in' };
    booking.checked_in_at = nowIso();
  }

  if (action === 'check_out') {
    booking.status = { label: toStatusLabel('completed'), value: 'completed' };
    booking.checked_out_at = nowIso();
  }

  if (action === 'cancel') {
    booking.status = { label: toStatusLabel('cancelled'), value: 'cancelled' };
  }

  return createSuccessResponse(booking);
};

export const handleBookingMock = ({ path, queryParams, method, data }: MockRequestContext): MockResult => {
  if (path === '/booking' && method === 'GET') {
    const result = handleGetBookings(queryParams);
    return {
      data: result.data,
      success: true,
      message: 'Success',
      pagination: result.pagination,
    };
  }

  if (path === '/booking/history' && method === 'GET') {
    const result = handleGetBookingHistory(queryParams);
    return {
      data: result.data,
      success: true,
      message: 'Success',
      pagination: result.pagination,
    };
  }

  if (path === '/booking/calendar-filter' && method === 'GET') {
    return createSuccessResponse(handleGetBookingCalendar(queryParams));
  }

  const matched = findBookingByPath(path);

  if (matched.detailUuid && method === 'GET') {
    const booking = bookingDb.find((item) => item.uuid === matched.detailUuid);
    return createSuccessResponse(booking || null);
  }

  if (matched.checkInUuid && method === 'POST') {
    return handleBookingAction(matched.checkInUuid, 'check_in');
  }

  if (matched.checkOutUuid && method === 'POST') {
    return handleBookingAction(matched.checkOutUuid, 'check_out');
  }

  if (matched.cancelUuid && method === 'POST') {
    return handleBookingAction(matched.cancelUuid, 'cancel');
  }

  const rescheduleMatch = path.match(/^\/booking\/([^/]+)\/reschedule$/u);
  if (rescheduleMatch && method === 'POST') {
    const uuid = rescheduleMatch[1];
    const booking = bookingDb.find((item) => item.uuid === uuid);
    if (!booking) {
      return createSuccessResponse(null, 'Booking not found');
    }
    const payload = data;
    booking.check_in = payload.check_in;
    booking.check_out = payload.check_out;
    booking.version += 1;
    booking.duration = Math.ceil(
      (new Date(payload.check_out).getTime() - new Date(payload.check_in).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return createSuccessResponse(booking, 'Booking rescheduled successfully');
  }

  const rescheduleDateMatch = path.match(/^\/booking\/([^/]+)\/reschedule-date$/u);
  if (rescheduleDateMatch && method === 'GET') {
    return createSuccessResponse([]);
  }

  if (path === '/booking/create' && method === 'POST') {
    const payload = data;
    const newBooking = {
      uuid: `bk-${Date.now()}`,
      booking_number: `BK-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      booking_date: nowIso(),
      check_in: payload.check_in,
      check_out: payload.check_out,
      checked_in_at: '',
      checked_out_at: '',
      duration: Math.ceil((new Date(payload.check_out).getTime() - new Date(payload.check_in).getTime()) / (1000 * 60 * 60 * 24)),
      total_payment: payload.total_payment,
      total_discount: payload.total_discount,
      payment_type: payload.payment_type || 'cash',
      status: { label: toStatusLabel(payload.status || 'pending'), value: payload.status || 'pending' },
      guest_info: payload.guest_info,
      guest_count: { adults: payload.adult_count, children: payload.child_count },
      membership: { uuid: 'mt-none', name: '-' },
      version: 1,
      rooms: payload.rooms?.map((r: any, idx: number) => ({
        uuid: `br-mock-${Date.now()}-${idx}`,
        quantity: r.quantity,
        price: r.price,
        total_price: r.total_price,
        room_type: { uuid: 'rt-mock', name: 'Mock Room Type' }, // Ideally fetch from room_pricing_uuid
        addons: r.addons?.map((a: any, aidx: number) => ({
          uuid: `ba-mock-${Date.now()}-${aidx}`,
          addon: { uuid: 'ad-mock', name: 'Mock Addon' },
          quantity: a.quantity,
          price: a.price,
          total_price: a.total_price,
        })) || [],
        is_cancellable: true,
        per_night_promos: [],
      })) || [],
      package_tours: payload.package_tours?.map((pt: any, idx: number) => ({
        uuid: `bpt-mock-${Date.now()}-${idx}`,
        package_tour: { uuid: 'tour-mock', name: 'Mock Package Tour' },
        price: pt.price,
        total_price: pt.total_price,
        quantity: pt.quantity,
      })) || [],
      vouchers: [],
    };
    
    bookingDb.unshift(newBooking as BookingRecord);
    return createSuccessResponse(newBooking);
  }

  return undefined;
};
