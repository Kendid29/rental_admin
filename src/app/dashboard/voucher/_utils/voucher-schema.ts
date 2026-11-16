import { z } from 'zod';

import { maxFileSize } from '@/constant';

export interface VoucherFormType {
  name: string;
  code: string;
  voucher_category_uuid: string;
  description: string;
  date_range: string;
  quantity: number;
  voucher_type: 'percentage' | 'nominal';
  discount_percentage: number;
  discount_nominal: number;
  minimum_spending: number;
  maximum_discount: number;
  photo_uuid: string;
  terms_and_conditions: string;
  is_published: boolean;
  is_published_cms: boolean;
  rooms: string[];
  villa_class_uuids: string[];
  package_tour_uuids?: string[];
  booking_date_range: string;
  booking_days: string[];
  active_start_time: string;
  active_finish_time: string;
  stay_date_range: string;
  version: number;
}

export const defaultVoucherForm: VoucherFormType = {
  name: '',
  code: '',
  voucher_category_uuid: '',
  description: '',
  date_range: '',
  quantity: 0,
  minimum_spending: 0,
  maximum_discount: 0,
  voucher_type: 'percentage',
  discount_percentage: 0,
  discount_nominal: 0,
  terms_and_conditions: '',
  photo_uuid: '',
  version: 0,
  is_published: false,
  is_published_cms: false,
  rooms: [],
  villa_class_uuids: [],
  package_tour_uuids: [],
  booking_date_range: '',
  booking_days: [],
  active_start_time: '',
  active_finish_time: '',
  stay_date_range: '',
};

export const voucherFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    code: z.string().min(1, 'Code is required'),
    description: z.string(),
    voucher_category_uuid: z.string().min(1, 'Category is required'),
    date_range: z.string().min(1, 'Date range is required'),
    quantity: z.number().min(1, 'Quantity is required'),
    minimum_spending: z.number().min(0, 'Minimum spending must be greater than or equal to 0'),
    maximum_discount: z.number().min(1, 'Maximum discount is required'),
    voucher_type: z.enum(['percentage', 'nominal']),
    discount_percentage: z.number(),
    discount_nominal: z.number(),
    terms_and_conditions: z.string().min(1, 'Terms and conditions is required'),
    rooms: z.array(z.string()),
    villa_class_uuids: z.array(z.string()),
    package_tour_uuids: z.array(z.string()).optional(),
    photo_uuid: z.union([
      z.string({ message: 'Image is required' }).min(1, { message: 'Image is required' }),
      z.instanceof(File, { message: 'Image is required' }).refine(
        (file) => {
          const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
          const maxSizeInBytes = maxFileSize * 1024 * 1024;

          return allowedTypes.includes(file.type) && file.size <= maxSizeInBytes;
        },
        {
          message: `Invalid file. Only JPEG/PNG images are allowed and file size should not exceed ${maxFileSize}MB.`,
        },
      ),
    ]),
    version: z.number().nullish(),
    is_published: z.boolean(),
    is_published_cms: z.boolean(),
    booking_date_range: z.string().min(1, 'Booking date range is required'),
    booking_days: z.array(z.string()).min(1, 'Booking days is required'),
    active_start_time: z.string().min(1, 'Active start time is required'),
    active_finish_time: z.string().min(1, 'Active finish time is required'),
    stay_date_range: z.string().min(1, 'Stay date range is required'),
  })
  .superRefine((data, ctx) => {
    if (data.voucher_type === 'percentage') {
      if (data.discount_percentage <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Discount percentage is required',
          path: ['discount_percentage'],
        });
      }
    }

    if (data.voucher_type === 'nominal') {
      if (data.discount_nominal <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Discount amount is required',
          path: ['discount_nominal'],
        });
      }
    }
  });
