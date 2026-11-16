export type ReimburseStatus = 'belum_dibayar' | 'sudah_dibayar';

export interface ReimburseMitraType {
  uuid: string;
  name: string;
  company?: string;
  city?: string;
  phone_number?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_holder?: string;
}

export interface ReimburseUnitType {
  uuid: string;
  name: string;
  category: string;
  plate_number?: string;
}

export interface ReimburseType {
  uuid: string;
  transaksi_uuid: string;
  booking_number: string;
  mitra: ReimburseMitraType;
  unit: ReimburseUnitType;
  total_transaction: number;
  platform_fee: number;
  nominal_reimburse: number;
  status: ReimburseStatus;
  payment_date: string | null;
  transfer_proof_url: string | null;
  transfer_reference: string | null;
  notes: string | null;
  created_at: string;
}

export interface PayReimbursePayload {
  payment_date: string;
  transfer_reference: string;
  transfer_proof_url: string;
  notes?: string;
}

export interface ReimburseQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
}

export interface ReimburseListResponse {
  data: ReimburseType[];
  meta: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}
