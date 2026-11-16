import { z } from 'zod';

export const userFormSchema = (isEdit: boolean) =>
  z.object({
    name: z.string().min(1, 'Nama wajib diisi'),
    email: z.string().email('Format email tidak valid'),
    role_uuid: z.string().min(1, 'Role wajib dipilih'),
    password: isEdit ? z.string().optional() : z.string().min(6, 'Kata sandi minimal 6 karakter'),
    password_confirmation: isEdit
      ? z.string().optional()
      : z.string().min(6, 'Konfirmasi kata sandi minimal 6 karakter'),
    phone_number: z.string().min(1, 'Nomor telepon wajib diisi'),
    status: z.string().optional(),
    version: z.number().nullish(),
    user_information_uuid: z.string().nullish(),
    user_information_version: z.number().nullish(),
  });

export type UserFormType = {
  name: string;
  email: string;
  role_uuid: string;
  password?: string;
  password_confirmation?: string;
  phone_number: string;
  status?: string;
  version?: number | null;
  user_information_uuid?: string | null;
  user_information_version?: number | null;
};

export const defaultUserForm: UserFormType = {
  name: '',
  email: '',
  role_uuid: '',
  password: '',
  password_confirmation: '',
  phone_number: '',
  status: 'aktif',
};

export type MemberFormType = UserFormType;
export const defaultMemberForm = defaultUserForm;
export const memberFormSchema = userFormSchema;
