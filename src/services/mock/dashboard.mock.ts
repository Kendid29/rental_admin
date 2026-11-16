import { createSuccessResponse } from './common';
import { MockRequestContext, MockResult } from './types';

const createBookingCountOverviewMock = (interval: string) => {
  if (interval === 'monthly') {
    return [
      { booking_date: '2025-01-01', month: '2025-01', total_bookings: 120 },
      { booking_date: '2025-02-01', month: '2025-02', total_bookings: 105 },
      { booking_date: '2025-03-01', month: '2025-03', total_bookings: 132 },
      { booking_date: '2025-04-01', month: '2025-04', total_bookings: 141 },
      { booking_date: '2025-05-01', month: '2025-05', total_bookings: 156 },
      { booking_date: '2025-06-01', month: '2025-06', total_bookings: 149 },
      { booking_date: '2025-07-01', month: '2025-07', total_bookings: 165 },
      { booking_date: '2025-08-01', month: '2025-08', total_bookings: 172 },
      { booking_date: '2025-09-01', month: '2025-09', total_bookings: 161 },
      { booking_date: '2025-10-01', month: '2025-10', total_bookings: 178 },
      { booking_date: '2025-11-01', month: '2025-11', total_bookings: 184 },
      { booking_date: '2025-12-01', month: '2025-12', total_bookings: 196 },
    ];
  }

  return [
    { booking_date: '2026-04-01', month: '2026-04', total_bookings: 7 },
    { booking_date: '2026-04-02', month: '2026-04', total_bookings: 5 },
    { booking_date: '2026-04-03', month: '2026-04', total_bookings: 8 },
    { booking_date: '2026-04-04', month: '2026-04', total_bookings: 4 },
    { booking_date: '2026-04-05', month: '2026-04', total_bookings: 6 },
    { booking_date: '2026-04-06', month: '2026-04', total_bookings: 9 },
    { booking_date: '2026-04-07', month: '2026-04', total_bookings: 11 },
    { booking_date: '2026-04-08', month: '2026-04', total_bookings: 10 },
    { booking_date: '2026-04-09', month: '2026-04', total_bookings: 12 },
    { booking_date: '2026-04-10', month: '2026-04', total_bookings: 8 },
    { booking_date: '2026-04-11', month: '2026-04', total_bookings: 7 },
    { booking_date: '2026-04-12', month: '2026-04', total_bookings: 9 },
    { booking_date: '2026-04-13', month: '2026-04', total_bookings: 6 },
    { booking_date: '2026-04-14', month: '2026-04', total_bookings: 10 },
  ];
};

const createBookingOverviewDetailMock = (type: string) => {
  if (type === 'check_in_detail') {
    return [
      {
        guest_name: 'Rina Kartika',
        status: 'check_in',
        check_in_at: '2026-04-22T08:30:00Z',
        room_count: 1,
        person_count: 2,
        image: '/img/lanadiya-logo.png',
      },
      {
        guest_name: 'Andi Prasetyo',
        status: 'check_in',
        check_in_at: '2026-04-22T10:10:00Z',
        room_count: 2,
        person_count: 4,
        image: '/img/lanadiya-logo.png',
      },
    ];
  }

  if (type === 'check_out_detail') {
    return [
      {
        guest_name: 'Maya Lestari',
        status: 'check_out',
        check_in_at: '2026-04-21T07:00:00Z',
        room_count: 1,
        person_count: 2,
        image: '/img/lanadiya-logo.png',
      },
    ];
  }

  return [
    {
      guest_name: 'Budi Santoso',
      status: 'reserved',
      check_in_at: '2026-04-23T14:00:00Z',
      room_count: 1,
      person_count: 2,
      image: '/img/grandia_logo.svg',
    },
    {
      guest_name: 'Dewi Anggraini',
      status: 'reserved',
      check_in_at: '2026-04-23T16:30:00Z',
      room_count: 2,
      person_count: 3,
      image: '/img/grandia_logo.svg',
    },
    {
      guest_name: 'Farhan Hidayat',
      status: 'reserved',
      check_in_at: '2026-04-24T09:30:00Z',
      room_count: 1,
      person_count: 1,
      image: '/img/grandia_logo.svg',
    },
  ];
};

const voucherCategoryMock = [
  {
    uuid: 'vc-room',
    name: 'Room Voucher',
    code: 'ROOM',
    description: 'Voucher for room promotions',
    queue: 1,
    is_published: true,
    is_published_cms: true,
    version: 1,
  },
  {
    uuid: 'vc-dining',
    name: 'Dining Voucher',
    code: 'DINING',
    description: 'Voucher for dining promotions',
    queue: 2,
    is_published: true,
    is_published_cms: true,
    version: 1,
  },
];

export const handleDashboardMock = ({
  path,
  queryParams,
  method,
}: MockRequestContext): MockResult => {
  if (path === '/dashboard/booking-count-overview' && method === 'GET') {
    const interval = queryParams.get('interval') || 'daily';
    return createSuccessResponse(createBookingCountOverviewMock(interval));
  }

  if (path === '/dashboard/booking-overview' && method === 'GET') {
    const type = queryParams.get('type') || 'overview';

    if (type === 'overview') {
      return createSuccessResponse({
        date: queryParams.get('date') || '2026-04-22',
        total_booking: 28,
        total_check_in: 9,
        total_check_out: 6,
      });
    }

    return createSuccessResponse(createBookingOverviewDetailMock(type));
  }

  if (path === '/dashboard/business-overview' && method === 'GET') {
    return createSuccessResponse({
      room_night: {
        total: 132,
        growth_percentage: 12.5,
      },
      average_daily_rate: {
        total: 715000,
        growth_percentage: 7.2,
      },
      revenue: {
        total: 94380000,
        growth_percentage: 9.4,
      },
    });
  }

  if (path === '/dashboard/promo-performance' && method === 'GET') {
    return createSuccessResponse([
      {
        booking_date: '2026-04-01',
        voucher_category: {
          uuid: 'vc-room',
          name: 'Room Voucher',
        },
        total_bookings: 4,
      },
      {
        booking_date: '2026-04-04',
        voucher_category: {
          uuid: 'vc-room',
          name: 'Room Voucher',
        },
        total_bookings: 6,
      },
      {
        booking_date: '2026-04-08',
        voucher_category: {
          uuid: 'vc-room',
          name: 'Room Voucher',
        },
        total_bookings: 5,
      },
      {
        booking_date: '2026-04-12',
        voucher_category: {
          uuid: 'vc-room',
          name: 'Room Voucher',
        },
        total_bookings: 7,
      },
      {
        booking_date: '2026-04-18',
        voucher_category: {
          uuid: 'vc-room',
          name: 'Room Voucher',
        },
        total_bookings: 8,
      },
    ]);
  }

  if (path === '/dashboard/customer-data' && method === 'GET') {
    const type = queryParams.get('type') || 'booking_window';

    if (type === 'length_of_stay') {
      return createSuccessResponse([
        { length_of_stay_category: '1 Night', total_bookings: 12 },
        { length_of_stay_category: '2 Nights', total_bookings: 20 },
        { length_of_stay_category: '3+ Nights', total_bookings: 8 },
      ]);
    }

    if (type === 'check_in_day') {
      return createSuccessResponse([
        { check_in_day: 'Monday', total_check_ins: 5 },
        { check_in_day: 'Tuesday', total_check_ins: 7 },
        { check_in_day: 'Wednesday', total_check_ins: 6 },
        { check_in_day: 'Thursday', total_check_ins: 8 },
        { check_in_day: 'Friday', total_check_ins: 10 },
        { check_in_day: 'Saturday', total_check_ins: 9 },
        { check_in_day: 'Sunday', total_check_ins: 4 },
      ]);
    }

    return createSuccessResponse([
      { booking_window_category: '0-1 Days', total_bookings: 10 },
      { booking_window_category: '2-3 Days', total_bookings: 14 },
      { booking_window_category: '4-7 Days', total_bookings: 9 },
      { booking_window_category: '8+ Days', total_bookings: 7 },
    ]);
  }

  if (path === '/promo/voucher/category' && method === 'GET') {
    return createSuccessResponse(voucherCategoryMock);
  }

  return undefined;
};
