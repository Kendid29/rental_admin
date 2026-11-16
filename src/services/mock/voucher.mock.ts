import { createSuccessResponse } from './common';
import VoucherType from '@/lib/types/voucher.type';

export const handleVoucherMock = (context: any) => {
  const { path, method } = context;

  if (path === '/voucher' && method === 'GET') {
    const mockVouchers: VoucherType[] = [
      {
        uuid: 'uuid-voucher-1',
        photo: { uuid: 'photo-1', url: 'https://via.placeholder.com/150' },
        name: 'Welcome Direct Booking',
        code: 'LANADIYA250',
        description: 'Rp 250.000 discount for direct bookings from the public website.',
        voucher_category: { uuid: 'cat-1', name: 'Direct Booking' },
        start_at: '2026-07-13T17:00:00.000Z',
        finish_at: '2026-09-30T16:59:59.000Z',
        minimum_spending: 2500000,
        maximum_discount: 250000,
        quantity: 100,
        rooms: [{ uuid: 'room-1', name: 'Deluxe Room' }],
        villa_classes: [{ uuid: 'villa-1', name: 'Presidential Villa' }],
        voucher_type: 'nominal',
        discount_percentage: 0,
        discount_nominal: 250000,
        terms_and_conditions: 'Valid once per booking with minimum spending Rp 2.500.000.',
        is_published: true,
        is_published_cms: true,
        version: 1,
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
      } as any,
    ];

    return createSuccessResponse(mockVouchers, 'Vouchers fetched successfully', {
      total: mockVouchers.length,
      page: 1,
      size: 10,
    });
  }

  return undefined;
};
