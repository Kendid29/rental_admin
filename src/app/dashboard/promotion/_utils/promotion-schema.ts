import { z } from 'zod';

export interface PromotionFormType {
  promo_category_uuid: string;
  name: string;
  code?: string | null;
  description: string;
  terms_and_conditions: string;
  promo_type: 'percentage' | 'nominal';
  discount_percentage: number;
  discount_nominal: any;
  maximum_discount?: number | null;
  is_published: boolean;
  is_published_cms: boolean;

  room_type_uuids: string[];
  villa_class_uuids?: string[];
  package_tour_uuids?: string[];

  // booking_start_date: string;
  // booking_finish_date: string;
  booking_date_range: string;
  booking_days: string[];
  active_start_time: string;
  active_finish_time: string;

  // stay_start_date: string;
  // stay_finish_date: string;
  stay_date_range: string;

  version?: number;
}

export const defaultPromotionForm: PromotionFormType = {
  promo_category_uuid: '',
  name: '',
  code: '',
  description: '',
  terms_and_conditions: '',
  promo_type: 'percentage',
  discount_percentage: 0,
  discount_nominal: 0,
  maximum_discount: 0,
  is_published: false,
  is_published_cms: false,

  room_type_uuids: [],
  villa_class_uuids: [],
  package_tour_uuids: [],

  booking_date_range: '',
  booking_days: [],
  active_start_time: '',
  active_finish_time: '',

  stay_date_range: '',
};

export const promotionFormSchema = z
  .object({
    promo_category_uuid: z.string().min(1, 'Promo category is required'),
    name: z.string().min(1, 'Name is required'),
    code: z.string().optional().nullable(),
    description: z.string().min(1, 'Description is required'),
    terms_and_conditions: z.string().min(1, 'Terms and conditions is required'),
    promo_type: z.enum(['percentage', 'nominal']),
    discount_percentage: z.number().min(0, 'Discount percentage must be greater than 0'),
    discount_nominal: z.number().min(0, 'Discount nominal must be greater than 0'),
    maximum_discount: z.number().min(0).optional().nullable(),
    is_published: z.boolean(),
    is_published_cms: z.boolean(),

    room_type_uuids: z.array(z.string()).min(1, 'Room types are required'),
    villa_class_uuids: z.array(z.string()).optional(),
    package_tour_uuids: z.array(z.string()).optional(),

    // booking_start_date: z.string(),
    // booking_finish_date: z.string(),
    booking_date_range: z.string().min(1, 'Booking date range is required'),
    booking_days: z.array(z.string()).min(1, 'Booking days is required'),
    active_start_time: z.string().min(1, 'Active start time is required'),
    active_finish_time: z.string().min(1, 'Active finish time is required'),

    // stay_start_date: z.string(),
    // stay_finish_date: z.string(),
    stay_date_range: z.string().min(1, 'Stay date range is required'),

    version: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.promo_type === 'percentage') {
      if (data.discount_percentage <= 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Discount percentage is required',
          path: ['discount_percentage'],
        });
      }
    }

    if (data.promo_type === 'nominal') {
      if (data.discount_nominal <= 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Discount nominal is required',
          path: ['discount_nominal'],
        });
      }
    }
  });
