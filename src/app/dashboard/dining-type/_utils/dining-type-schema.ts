import { z } from 'zod';

export interface DiningTypeFormType {
  name: string;
  code: string;
  description: string;
  version?: number | null;
}

export const defaultDiningTypeForm = {
  name: '',
  code: '',
  description: '',
};

export const diningTypeFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string(),
  version: z.number().nullish(),
});
