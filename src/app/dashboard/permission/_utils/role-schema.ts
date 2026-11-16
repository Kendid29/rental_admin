import { z } from 'zod';

export interface RoleFormType {
  name: string;
  code: string;
  description: string;
  version?: number | null;
}

export const defaultRoleForm = {
  name: '',
  code: '',
  description: '',
};

export const roleFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string(),
  version: z.number().nullish(),
});
