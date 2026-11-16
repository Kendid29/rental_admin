# Web Admin Rentalin Aja

Web Admin untuk platform rental kendaraan dan barang **Rentalin Aja** (Next.js 16, React 19, MUI 7, TypeScript, Tailwind v4).

## Fitur Utama

- **Pengguna**: Manajemen ADMIN, USER, dan PERMISSION
- **Mitra**: MASTER MITRA dan inventaris unit
- **Master Data**: Vehicle category (Mobil, Motor, sub-kategori), MASTER, RULES
- **Transaksi**: Manajemen alur transaksi sewa Rentalin Aja
- **Reimburse**: Pembayaran mitra untuk transaksi selesai
- **Update & Suspend**: Jejak audit perubahan dan penangguhan

## Memulai Pengembangan

Jalankan perintah berikut:

```bash
pnpm install
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

## Konfigurasi Lingkungan

Konfigurasi lingkungan dapat diatur melalui `.env` atau `.env.local`:

- `NEXT_PUBLIC_API_URL` — Backend base URL
- `NEXT_PUBLIC_API_VERSION` — Versi API (contoh: `api/v1`)
- `NEXT_PUBLIC_CLIENT_VERSION` — Header versi client
- `NEXT_PUBLIC_USE_MOCK_API` — Nilai `true` untuk menggunakan mock stateful lokal, atau `false` untuk API backend riil.
