import { z } from 'zod';

export interface AdminFormType {
  name: string;
  email: string;
  role_uuid: string;
  password?: string;
  password_confirmation?: string;
  phone_number: string;
  status?: string;
  user_information_uuid?: string | null;
  user_information_version?: number | null;
  version?: number | null;
}

export const defaultAdminForm: AdminFormType = {
  name: '',
  email: '',
  role_uuid: '',
  password: '',
  password_confirmation: '',
  phone_number: '+62',
  status: 'aktif',
};

export const adminFormSchema = (isEdit: boolean) =>
  z
    .object({
      name: z.string().min(1, 'Nama wajib diisi'),
      email: z.string().email('Format email tidak valid').min(1, 'Email wajib diisi'),
      role_uuid: z.string().min(1, 'Role wajib dipilih'),
      password: z.string().optional().default(''),
      password_confirmation: z.string().optional().default(''),
      phone_number: z.string().min(1, 'Nomor telepon wajib diisi'),
      status: z.string().optional().default('aktif'),
      user_information_uuid: z.string().nullish(),
      user_information_version: z.number().nullish(),
      version: z.number().nullish(),
    })
    .refine(
      (data) => {
        if (!isEdit && (!data.password || data.password.length < 6)) {
          return false;
        }
        if (data.password && data.password !== data.password_confirmation) {
          return false;
        }
        return true;
      },
      {
        message: 'Kata sandi minimal 6 karakter dan konfirmasi harus cocok',
        path: ['password_confirmation'],
      },
    );

export type StaffFormType = AdminFormType;
export const defaultStaffForm = defaultAdminForm;
export const staffFormSchema = adminFormSchema;
