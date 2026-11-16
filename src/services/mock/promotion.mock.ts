import { createSuccessResponse } from './common';
import PromotionType from '@/lib/types/promotion.type';

export const handlePromotionMock = (context: any) => {
  const { path, method } = context;

  if (path === '/promo' && method === 'GET') {
    const mockPromotions: PromotionType[] = [
      {
        uuid: 'uuid-promo-1',
        promo_category: { uuid: 'cat-1', name: 'Discount' },
        name: 'Summer Sale',
        code: 'SUMMER2026',
        description: 'Special summer discount for all rooms',
        terms_and_conditions: 'Valid for stays during summer',
        promo_type: 'percentage',
        discount_percentage: 15,
        discount_nominal: 0,
        minimum_spending: 500000,
        maximum_discount: 1000000,
        is_published: true,
        is_published_cms: true,
        version: 1,
        promo_schedule_config: {
          booking_start_date: '2026-06-01',
          booking_finish_date: '2026-08-31',
          booking_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          active_start_time: '00:00:00',
          active_finish_time: '23:59:59',
          stay_start_date: '2026-06-01',
          stay_finish_date: '2026-08-31',
        },
        room_types: [{ uuid: 'room-1', name: 'Deluxe Room' }],
        villa_classes: [{ uuid: 'villa-1', name: 'Presidential Villa' }],
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
      } as any,
    ];

    return createSuccessResponse(mockPromotions, 'Promotions fetched successfully', {
      total: mockPromotions.length,
      page: 1,
      size: 10,
    });
  }

  return undefined;
};
