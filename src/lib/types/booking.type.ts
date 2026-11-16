export type TransaksiStatus =
  | 'menunggu_konfirmasi'
  | 'terkonfirmasi'
  | 'diteruskan_mitra'
  | 'berjalan'
  | 'selesai'
  | 'dibatalkan';

export interface TransaksiTimelineItem {
  status: TransaksiStatus;
  label: string;
  timestamp: string;
  actor: string;
  notes?: string;
}

export interface TransaksiUnitType {
  uuid: string;
  name: string;
  category: string;
  plate_number?: string;
  price_per_day: number;
}

export interface TransaksiMitraType {
  uuid: string;
  name: string;
  company?: string;
  city?: string;
  phone_number?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_holder?: string;
}

export interface TransaksiUserType {
  uuid: string;
  name: string;
  email: string;
  phone_number: string;
}

export interface BookingGuestInfoType {
  name: string;
  email: string;
  phone_number: string;
}

export interface BookingInvoiceType {
  number: string;
  subtotal: number;
  discount: number;
  grand_total: number;
}

export interface BookingType {
  uuid: string;
  booking_number: string;
  booking_date: string;
  status: {
    label: string;
    value: TransaksiStatus | string;
  };
  check_in: string; // tanggal mulai sewa
  check_out: string; // tanggal selesai sewa
  duration: number; // jumlah hari sewa
  total_payment: number;
  total_discount: number;
  payment_type: string;
  user: TransaksiUserType;
  unit: TransaksiUnitType;
  mitra: TransaksiMitraType;
  timeline: TransaksiTimelineItem[];
  reimburse_status?: 'belum_dibayar' | 'sudah_dibayar' | 'tidak_ada';
  reimburse_uuid?: string;
  guest_info: BookingGuestInfoType;
  version: number;
  invoice?: BookingInvoiceType;
  // backward compat fields
  rooms?: any[];
  package_tours?: any[];
  vouchers?: any[];
  checked_in_at?: string;
  checked_out_at?: string;
}

export type TransaksiType = BookingType;
export type BookingDetailType = BookingType;
export default BookingType;
