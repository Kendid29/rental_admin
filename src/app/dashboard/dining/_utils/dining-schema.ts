import { z } from 'zod';

import { maxFileSize } from '@/constant';

export interface DiningFormType {
  name: string;
  code: string;
  description: string;
  dish_types: string[];
  location: string;
  operational_days: string;
  start_hour: string;
  end_hour: string;
  capacity: number;
  images: any[];
  is_published_cms: boolean;
  version?: number | null;
}

export const defaultDiningForm: DiningFormType = {
  name: '',
  code: '',
  description: '',
  dish_types: [],
  location: '',
  operational_days: '',
  start_hour: '',
  end_hour: '',
  capacity: 0,
  images: [],
  is_published_cms: false,
  version: null,
};

export const diningFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string(),
  dish_types: z.array(z.string()).min(1, 'Dish types is required'),
  location: z.string().min(1, 'Location is required'),
  operational_days: z.string().min(1, 'Operational days is required'),
  start_hour: z.string().min(1, 'Start hour is required'),
  end_hour: z.string().min(1, 'End hour is required'),
  is_published_cms: z.boolean(),
  capacity: z.number().min(1, 'Capacity is required'),
  images: z
    .array(
      z.union([
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
    )
    .min(1, 'Photo is required'),
  version: z.number().nullish(),
});
