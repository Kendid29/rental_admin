import { z } from 'zod';

export interface MemberFormType {
  name: string;
  email: string;
  role_uuid: string;
  password: string;
  password_confirmation: string;
  phone_number: string;
  version?: number | null;
  user_information_uuid?: string | null;
  user_information_version?: number | null;
}

export const defaultMemberForm: MemberFormType = {
  name: '',
  email: '',
  role_uuid: '',
  password: '',
  password_confirmation: '',
  phone_number: '',
};

export const memberFormSchema = (isEdit: boolean) =>
  z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    role_uuid: z.string().min(1, 'Role is required'),
    password: isEdit
      ? z.string().min(8, 'Password must be at least 8 characters').optional()
      : z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: isEdit
      ? z.string().optional()
      : z.string().min(8, 'Password must be at least 8 characters'),
    phone_number: z.string().min(1, 'Phone number is required'),
    version: z.number().nullable().optional(),
    user_information_uuid: z.string().nullable().optional(),
    user_information_version: z.number().nullable().optional(),
  });
