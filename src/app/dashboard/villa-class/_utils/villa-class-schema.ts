import { z } from 'zod';

import { maxFileSize } from '@/constant';

export interface VillaClassFormType {
  name: string;
  code?: string | null;
  description?: string | null;
  address?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  max_guest: number;
  check_in_time?: string | null;
  check_out_time?: string | null;
  is_active: boolean;
  thumbnail_uuid?: any;
  images?: any[];
  version?: number | null;
}

export const defaultVillaClassForm: VillaClassFormType = {
  name: '',
  code: '',
  description: '',
  address: '',
  latitude: '',
  longitude: '',
  max_guest: 0,
  check_in_time: '14:00',
  check_out_time: '12:00',
  is_active: true,
  thumbnail_uuid: null,
  images: [],
};

export const villaClassFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  latitude: z.union([z.string(), z.number()]).nullable().optional(),
  longitude: z.union([z.string(), z.number()]).nullable().optional(),
  max_guest: z.number().min(1, 'Max guests must be at least 1'),
  check_in_time: z.string().nullable().optional(),
  check_out_time: z.string().nullable().optional(),
  is_active: z.boolean(),
  version: z.number().nullish(),
  thumbnail_uuid: z
    .union([
      z.string({ message: 'Thumbnail is required' }).min(1, { message: 'Thumbnail is required' }),
      z.instanceof(File, { message: 'Thumbnail is required' }).refine(
        (file) => {
          const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
          const maxSizeInBytes = maxFileSize * 1024 * 1024;

          return allowedTypes.includes(file.type) && file.size <= maxSizeInBytes;
        },
        {
          message: `Invalid file. Only JPEG/PNG images are allowed and file size should not exceed ${maxFileSize}MB.`,
        },
      ),
    ])
    .nullable()
    .optional(),
  images: z
    .array(
      z.union([
        z.string(),
        z.instanceof(File).refine(
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
    )
    .optional()
    .default([]),
});
