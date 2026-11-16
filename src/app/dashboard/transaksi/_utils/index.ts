export const TRANSAKSI_STATUS = [
  { label: 'Semua Status', value: '' },
  { label: 'Menunggu Konfirmasi', value: 'menunggu_konfirmasi' },
  { label: 'Terkonfirmasi', value: 'terkonfirmasi' },
  { label: 'Diteruskan ke Mitra', value: 'diteruskan_mitra' },
  { label: 'Mulai Sewa / Berjalan', value: 'berjalan' },
  { label: 'Selesai', value: 'selesai' },
  { label: 'Dibatalkan', value: 'dibatalkan' },
];

export const getBookingStatusColor = (
  status: string,
): 'warning' | 'info' | 'secondary' | 'primary' | 'success' | 'error' | 'default' => {
  switch (status) {
    case 'menunggu_konfirmasi':
    case 'pending':
      return 'warning';
    case 'terkonfirmasi':
    case 'confirmed':
      return 'info';
    case 'diteruskan_mitra':
      return 'secondary';
    case 'berjalan':
    case 'checked_in':
      return 'primary';
    case 'selesai':
    case 'completed':
      return 'success';
    case 'dibatalkan':
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

export const getBookingStatusLabel = (status: string): string => {
  switch (status) {
    case 'menunggu_konfirmasi':
    case 'pending':
      return 'Menunggu Konfirmasi';
    case 'terkonfirmasi':
    case 'confirmed':
      return 'Terkonfirmasi';
    case 'diteruskan_mitra':
      return 'Diteruskan ke Mitra';
    case 'berjalan':
    case 'checked_in':
      return 'Mulai Sewa / Berjalan';
    case 'selesai':
    case 'completed':
      return 'Selesai';
    case 'dibatalkan':
    case 'cancelled':
      return 'Dibatalkan';
    default:
      return status;
  }
};

export const BOOKING_STATUS = TRANSAKSI_STATUS;
