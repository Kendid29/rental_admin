import { z } from 'zod';

export interface StaffFormType {
  name: string;
  email: string;
  role_uuid: string;
  password: string;
  password_confirmation: string;
  phone_number: string;
  user_information_uuid?: string | null;
  user_information_version?: number | null;
  version?: number | null;
}

export const defaultStaffForm: StaffFormType = {
  name: '',
  email: '',
  role_uuid: '',
  password: '',
  password_confirmation: '',
  phone_number: '62',
};

export const staffFormSchema = (isEdit: boolean) =>
  z
    .object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email().min(1, 'Email is required'),
      role_uuid: z.string().min(1, 'Role is required'),
      password: z.string().min(isEdit ? 0 : 1, 'Password is required'),
      password_confirmation: z.string().min(isEdit ? 0 : 1, 'Password confirmation is required'),
      phone_number: z.string().min(1, 'Phone number is required'),
      user_information_uuid: z.string().nullish(),
      user_information_version: z.number().nullish(),
      version: z.number().nullish(),
    })
    .refine(
      // (data) => (data.password || !isEdit ? data.password === data.password_confirmation : true),
      (data) => (data.password ? data.password === data.password_confirmation : true),
      {
        message: "Password doesn't match",
        path: ['password_confirmation'],
      },
    );
