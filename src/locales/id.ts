export interface TranslationType {
  auth: {
    title: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    loginBtn: string;
    loggingIn: string;
  };
  header: {
    searchPlaceholder: string;
    profile: string;
    logout: string;
    language: string;
  };
  sidebar: Record<string, string>;
  common: Record<string, string>;
  status: Record<string, string>;
  pages: Record<string, string>;
}

export const id: TranslationType = {
  auth: {
    title: 'Rentaku Admin',
    subtitle: 'Masukkan email dan kata sandi Anda untuk masuk ke Rentaku Admin',
    emailLabel: 'Email',
    emailPlaceholder: 'Masukkan email Anda',
    passwordLabel: 'Kata Sandi',
    passwordPlaceholder: 'Masukkan kata sandi Anda',
    loginBtn: 'Masuk',
    loggingIn: 'Sedang masuk...',
  },
  header: {
    searchPlaceholder: 'Cari menu navigasi...',
    profile: 'Profil',
    logout: 'Keluar',
    language: 'Pilihan Bahasa',
  },
  sidebar: {
    pengguna: 'Pengguna',
    admin: 'ADMIN',
    user: 'USER',
    permission: 'PERMISSION',
    mitra: 'Mitra',
    'master mitra': 'MASTER MITRA',
    'master data': 'Master Data',
    'vehicle category': 'Vehicle category',
    master: 'MASTER',
    rules: 'RULES',
    transaksi: 'TRANSAKSI',
    reimburse: 'REIMBURSE',
    lainnya: 'Lainnya',
    update: 'UPDATE',
    suspend: 'SUSPEND',
  },
  status: {
    active: 'Aktif',
    inactive: 'Tidak Aktif',
    menunggu_konfirmasi: 'Menunggu Konfirmasi',
    terkonfirmasi: 'Terkonfirmasi',
    diteruskan_mitra: 'Diteruskan ke Mitra',
    berjalan: 'Berjalan',
    selesai: 'Selesai',
    dibatalkan: 'Dibatalkan',
    belum_dibayar: 'Belum Dibayar',
    sudah_dibayar: 'Sudah Dibayar',
  },
  common: {},
  pages: {
    unit: 'Unit',
    units: 'Unit',
    transaksi: 'Transaksi',
    mitra: 'Mitra',
    'mulai sewa': 'Mulai Sewa',
    selesai: 'Selesai',
    reimburse: 'Reimburse',
    'segera hadir': 'Segera hadir',
  },
};
