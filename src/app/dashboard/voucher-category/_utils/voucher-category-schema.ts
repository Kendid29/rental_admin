import { z } from 'zod';

export interface VoucherCategoryFormType {
  name: string;
  code: string;
  queue: number;
  is_published: boolean;
  is_published_cms: boolean;
  description?: string;
  version?: number;
}

export const defaultVoucherCategoryForm: VoucherCategoryFormType = {
  name: '',
  code: '',
  queue: 0,
  is_published: false,
  is_published_cms: false,
  description: '',
};

export const voucherCategoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  queue: z.number().min(1, 'Queue is required'),
  is_published: z.boolean().default(false),
  is_published_cms: z.boolean().default(false),
  description: z.string().optional(),
  version: z.number().optional(),
});
