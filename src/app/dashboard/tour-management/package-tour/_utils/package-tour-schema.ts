import { z } from 'zod';

import { maxFileSize } from '@/constant';

export interface PackageTourFormType {
  name: string;
  code: string;
  quantity: number;
  current_quantity: number;
  description: string;
  is_active: boolean;
  image_uuid: string;
  version?: number | null;
}

export const defaultPackageTourForm: PackageTourFormType = {
  name: '',
  code: '',
  quantity: 0,
  current_quantity: 0,
  description: '',
  is_active: true,
  image_uuid: '',
};

export const PackageTourFormSchema = (isEdit: boolean) =>
  z.object({
    name: z.string().min(1, 'Name is required'),
    code: z.string().min(1, 'Code is required'),
    quantity: z.number().min(1, 'Quantity is required'),
    current_quantity: z.number().min(isEdit ? 1 : 0, 'Current quantity is required'),
    description: z.string(),
    is_active: z.boolean(),
    version: z.number().nullish(),
    image_uuid: z.union([
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
  });

