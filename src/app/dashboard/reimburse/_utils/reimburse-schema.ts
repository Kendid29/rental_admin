import { z } from 'zod';

export interface PayReimburseFormType {
  payment_date: string;
  transfer_reference: string;
  transfer_proof_url: string;
  notes?: string;
}

export const defaultPayReimburseForm: PayReimburseFormType = {
  payment_date: new Date().toISOString().split('T')[0],
  transfer_reference: '',
  transfer_proof_url: '',
  notes: '',
};

export const payReimburseSchema = z.object({
  payment_date: z.string().min(1, 'Tanggal bayar wajib diisi'),
  transfer_reference: z.string().min(3, 'Nomor referensi transfer minimal 3 karakter'),
  transfer_proof_url: z.string().min(1, 'Bukti transfer wajib diunggah'),
  notes: z.string().optional().default(''),
});
