import { z } from 'zod';

export const mitraFormSchema = z.object({
  name: z.string().min(1, 'Nama mitra wajib diisi'),
  email: z.string().email('Format email tidak valid'),
  phone_number: z.string().min(1, 'Nomor kontak wajib diisi'),
  address: z.string().min(1, 'Alamat wajib diisi'),
  city: z.string().min(1, 'Kota wajib diisi'),
  cooperation_status: z.string(),
  bank_name: z.string().min(1, 'Nama bank wajib diisi'),
  bank_account_number: z.string().min(1, 'Nomor rekening wajib diisi'),
  bank_account_holder: z.string().min(1, 'Nama pemilik rekening wajib diisi'),
  location: z.string().nullish(),
  company: z.string().nullish(),
  version: z.number().nullish(),
});

export type MitraFormType = z.infer<typeof mitraFormSchema>;

export const defaultMitraForm: MitraFormType = {
  name: '',
  email: '',
  phone_number: '+62',
  address: '',
  city: '',
  cooperation_status: 'aktif',
  bank_name: 'BCA',
  bank_account_number: '',
  bank_account_holder: '',
  location: '',
  company: '',
  version: 1,
};

export type AgentFormType = MitraFormType;
export const defaultAgentForm = defaultMitraForm;
export const agentFormSchema = mitraFormSchema;
