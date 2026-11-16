const TAGS = {
  AUTH: 'AUTH',
  ADMIN: 'ADMIN',
  USER: 'USER',
  ROLE: 'ROLE',
  PERMISSION: 'PERMISSION',
  PERMISSIONS: 'PERMISSIONS',
  MITRA: 'MITRA',
  VEHICLE_CATEGORY: 'VEHICLE_CATEGORY',
  TRANSAKSI: 'TRANSAKSI',
  REIMBURSE: 'REIMBURSE',
  UPDATE: 'UPDATE',
  RULES: 'RULES',
  MASTER: 'MASTER',
  SUSPEND: 'SUSPEND',

  // Aliases for transition
  STAFF: 'ADMIN',
  MEMBER: 'USER',
  AGENT: 'MITRA',
  BOOKING: 'TRANSAKSI',
  ACTIVITY_LOG: 'UPDATE',
} as const;

export const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default TAGS;
