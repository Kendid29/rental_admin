# Audit Revisi Codebase: LaNadiya Admin ke Web Admin Rentaku

Dokumen ini berisi hasil audit menyeluruh terhadap codebase sebelum eksekusi refaktorisasi menjadi Web Admin Rentaku, sesuai instruksi revisi.

---

## 1. Daftar Semua Route di `src/app/dashboard/**/page.tsx`

Berikut adalah seluruh rute `page.tsx` yang ditemukan di bawah `src/app/dashboard`:

| No | Path Halaman | Status Rencana | Alasan & Keterangan |
|---|---|---|---|
| 1 | `src/app/dashboard/home/page.tsx` | Hapus | Dashboard analytics lama tidak relevan |
| 2 | `src/app/dashboard/activity-log/page.tsx` | Ganti nama (`update`) | Dipertahankan fungsinya sebagai modul UPDATE (audit log) |
| 3 | `src/app/dashboard/activity/page.tsx` | Hapus | CMS Aktivitas lama tidak relevan |
| 4 | `src/app/dashboard/activity/new/page.tsx` | Hapus | CMS Aktivitas lama tidak relevan |
| 5 | `src/app/dashboard/activity/[uuid]/page.tsx` | Hapus | CMS Aktivitas lama tidak relevan |
| 6 | `src/app/dashboard/agent/page.tsx` | Ganti nama (`mitra`) | Menjadi MASTER MITRA |
| 7 | `src/app/dashboard/agent/new/page.tsx` | Ganti nama (`mitra/new`) | Form tambah Mitra |
| 8 | `src/app/dashboard/agent/[uuid]/page.tsx` | Ganti nama (`mitra/[uuid]`) | Detail Mitra (berisi unit milik mitra) |
| 9 | `src/app/dashboard/agent/[uuid]/history/page.tsx` | Hapus | Sesuai instruksi: hapus tab history agent |
| 10 | `src/app/dashboard/booking/page.tsx` | Ganti nama (`transaksi`) | Menjadi TRANSAKSI |
| 11 | `src/app/dashboard/booking/new/page.tsx` | Hapus | Manual booking dihapus |
| 12 | `src/app/dashboard/booking/[uuid]/page.tsx` | Ganti nama (`transaksi/[uuid]`) | Detail transaksi |
| 13 | `src/app/dashboard/booking-report/page.tsx` | Hapus | Laporan lama dihapus |
| 14 | `src/app/dashboard/payment-report/page.tsx` | Ganti nama/pola (`reimburse`) | Pola tabel digunakan untuk modul REIMBURSE |
| 15 | `src/app/dashboard/dining/page.tsx` | Hapus | Modul restoran/layanan dihapus |
| 16 | `src/app/dashboard/dining/new/page.tsx` | Hapus | Modul restoran/layanan dihapus |
| 17 | `src/app/dashboard/dining/[uuid]/page.tsx` | Hapus | Modul restoran/layanan dihapus |
| 18 | `src/app/dashboard/dining-type/page.tsx` | Hapus | Modul restoran/layanan dihapus |
| 19 | `src/app/dashboard/dining-type/new/page.tsx` | Hapus | Modul restoran/layanan dihapus |
| 20 | `src/app/dashboard/dining-type/[uuid]/page.tsx` | Hapus | Modul restoran/layanan dihapus |
| 21 | `src/app/dashboard/gallery/page.tsx` | Hapus | Modul konten galeri dihapus |
| 22 | `src/app/dashboard/gallery/new/page.tsx` | Hapus | Modul konten galeri dihapus |
| 23 | `src/app/dashboard/gallery/[uuid]/page.tsx` | Hapus | Modul konten galeri dihapus |
| 24 | `src/app/dashboard/meeting-event/page.tsx` | Hapus | Modul meeting/event dihapus |
| 25 | `src/app/dashboard/meeting-event/new/page.tsx` | Hapus | Modul meeting/event dihapus |
| 26 | `src/app/dashboard/meeting-event/[uuid]/page.tsx` | Hapus | Modul meeting/event dihapus |
| 27 | `src/app/dashboard/meeting-layout/page.tsx` | Hapus | Modul meeting/event dihapus |
| 28 | `src/app/dashboard/meeting-layout/new/page.tsx` | Hapus | Modul meeting/event dihapus |
| 29 | `src/app/dashboard/meeting-layout/[uuid]/page.tsx` | Hapus | Modul meeting/event dihapus |
| 30 | `src/app/dashboard/member/page.tsx` | Ganti nama (`user`) | Menjadi USER |
| 31 | `src/app/dashboard/member/new/page.tsx` | Ganti nama (`user/new`) | Tambah User |
| 32 | `src/app/dashboard/member/[uuid]/page.tsx` | Ganti nama (`user/[uuid]`) | Detail User & riwayat transaksi |
| 33 | `src/app/dashboard/promotion/page.tsx` | Hapus | Marketing promosi dihapus |
| 34 | `src/app/dashboard/promotion/new/page.tsx` | Hapus | Marketing promosi dihapus |
| 35 | `src/app/dashboard/promotion/[uuid]/page.tsx` | Hapus | Marketing promosi dihapus |
| 36 | `src/app/dashboard/promotion-category/page.tsx` | Hapus | Marketing promosi dihapus |
| 37 | `src/app/dashboard/promotion-category/new/page.tsx` | Hapus | Marketing promosi dihapus |
| 38 | `src/app/dashboard/promotion-category/[uuid]/page.tsx` | Hapus | Marketing promosi dihapus |
| 39 | `src/app/dashboard/role/page.tsx` | Ganti nama (`permission`) | Digabung menjadi PERMISSION |
| 40 | `src/app/dashboard/role/new/page.tsx` | Ganti nama (`permission/new`) | Tambah role/permission |
| 41 | `src/app/dashboard/role/[uuid]/page.tsx` | Ganti nama (`permission/[uuid]`) | Edit role/permission |
| 42 | `src/app/dashboard/role/[uuid]/permission/page.tsx` | Ganti nama (`permission/[uuid]/matrix`) | Matriks role-permission |
| 43 | `src/app/dashboard/room-addon/page.tsx` | Hapus | Modul Room/Villa dihapus |
| 44 | `src/app/dashboard/room-addon/new/page.tsx` | Hapus | Modul Room/Villa dihapus |
| 45 | `src/app/dashboard/room-addon/[uuid]/page.tsx` | Hapus | Modul Room/Villa dihapus |
| 46 | `src/app/dashboard/room-facilities/page.tsx` | Hapus | Modul Room/Villa dihapus |
| 47 | `src/app/dashboard/room-facilities/new/page.tsx` | Hapus | Modul Room/Villa dihapus |
| 48 | `src/app/dashboard/room-facilities/[uuid]/page.tsx` | Hapus | Modul Room/Villa dihapus |
| 49 | `src/app/dashboard/room-on-request-facilities/page.tsx` | Hapus | Modul Room/Villa dihapus |
| 50 | `src/app/dashboard/room-on-request-facilities/new/page.tsx` | Hapus | Modul Room/Villa dihapus |
| 51 | `src/app/dashboard/room-on-request-facilities/[uuid]/page.tsx` | Hapus | Modul Room/Villa dihapus |
| 52 | `src/app/dashboard/rooms-and-pricing/page.tsx` | Hapus | Modul Room/Villa dihapus |
| 53 | `src/app/dashboard/rooms-and-pricing/new/page.tsx` | Hapus | Modul Room/Villa dihapus |
| 54 | `src/app/dashboard/rooms-and-pricing/[uuid]/page.tsx` | Hapus | Modul Room/Villa dihapus |
| 55 | `src/app/dashboard/rooms-and-pricing/bulk-edit/page.tsx` | Hapus | Modul Room/Villa dihapus |
| 56 | `src/app/dashboard/room-type/page.tsx` | Hapus | Modul Room/Villa dihapus |
| 57 | `src/app/dashboard/room-type/new/page.tsx` | Hapus | Modul Room/Villa dihapus |
| 58 | `src/app/dashboard/room-type/[uuid]/page.tsx` | Hapus | Modul Room/Villa dihapus |
| 59 | `src/app/dashboard/staff/page.tsx` | Ganti nama (`admin`) | Menjadi modul ADMIN |
| 60 | `src/app/dashboard/staff/new/page.tsx` | Ganti nama (`admin/new`) | Tambah Admin |
| 61 | `src/app/dashboard/staff/[uuid]/page.tsx` | Ganti nama (`admin/[uuid]`) | Edit Admin |
| 62 | `src/app/dashboard/tour-management/package-tour/page.tsx` | Hapus | Modul tur dihapus |
| 63 | `src/app/dashboard/tour-management/package-tour/new/page.tsx` | Hapus | Modul tur dihapus |
| 64 | `src/app/dashboard/tour-management/package-tour/[uuid]/page.tsx` | Hapus | Modul tur dihapus |
| 65 | `src/app/dashboard/tour-management/package-tour-pricing/page.tsx` | Hapus | Modul tur dihapus |
| 66 | `src/app/dashboard/tour-management/package-tour-pricing/new/page.tsx` | Hapus | Modul tur dihapus |
| 67 | `src/app/dashboard/tour-management/package-tour-pricing/[uuid]/page.tsx` | Hapus | Modul tur dihapus |
| 68 | `src/app/dashboard/tour-management/package-tour-pricing/bulk-edit/page.tsx` | Hapus | Modul tur dihapus |
| 69 | `src/app/dashboard/villa-class/page.tsx` | Ganti nama/pola (`vehicle-category`) | Pola CRUD digunakan untuk Vehicle category |
| 70 | `src/app/dashboard/villa-class/new/page.tsx` | Ganti nama/pola (`vehicle-category/new`) | Tambah Vehicle category |
| 71 | `src/app/dashboard/villa-class/[uuid]/page.tsx` | Ganti nama/pola (`vehicle-category/[uuid]`) | Edit Vehicle category |
| 72 | `src/app/dashboard/voucher/page.tsx` | Hapus | Marketing voucher dihapus |
| 73 | `src/app/dashboard/voucher/new/page.tsx` | Hapus | Marketing voucher dihapus |
| 74 | `src/app/dashboard/voucher/[uuid]/page.tsx` | Hapus | Marketing voucher dihapus |
| 75 | `src/app/dashboard/voucher-category/page.tsx` | Hapus | Marketing voucher dihapus |
| 76 | `src/app/dashboard/voucher-category/new/page.tsx` | Hapus | Marketing voucher dihapus |
| 77 | `src/app/dashboard/voucher-category/[uuid]/page.tsx` | Hapus | Marketing voucher dihapus |
| 78 | `src/app/dashboard/rules/page.tsx` | Baru | Placeholder: "Segera hadir" |
| 79 | `src/app/dashboard/master/page.tsx` | Baru | Placeholder: "Segera hadir" |
| 80 | `src/app/dashboard/suspend/page.tsx` | Baru | Placeholder: "Segera hadir" |

---

## 2. Mock Handler (`src/services/mock/*.mock.ts`) dan Router (`src/services/mock/router.ts`)

| Handler File | Handler Export di `router.ts` | Status | Rencana Penyesuaian |
|---|---|---|---|
| `auth.mock.ts` | `handleAuthMock` | Pertahankan & Sesuaikan | Perbarui katalog modul permission (`admin`, `user`, `permission`, `mitra`, `vehicle_category`, `master`, `rules`, `transaksi`, `reimburse`, `update`, `suspend`) dan hapus logo/nama lama |
| `dashboard.mock.ts` | `handleDashboardMock` | Hapus | Seluruh mock dashboard analytics dihapus |
| `booking.mock.ts` | `handleBookingMock` | Ganti nama & Ubah (`transaksi.mock.ts`) | Ubah status alur: `menunggu_konfirmasi`, `terkonfirmasi`, `diteruskan_mitra`, `berjalan`, `selesai`, `dibatalkan`. Simpan stateful di localStorage |
| `reports.mock.ts` | `handleReportsMock` | Hapus | Mock booking report dan payment report lama dihapus |
| `user-management.mock.ts` | `handleUserManagementMock` | Ganti nama & Sesuaikan (`user-management.mock.ts` / `admin.mock.ts`) | Pertahankan data admin, user, role; jadikan stateful di localStorage |
| `membership.mock.ts` | `handleMembershipMock` | Hapus | Membership dihapus |
| `agent.mock.ts` | `handleAgentMock` | Ganti nama (`mitra.mock.ts`) | Disesuaikan menjadi data MASTER MITRA (dengan relasi unit), stateful di localStorage |
| `room-facilities.mock.ts` | `handleRoomFacilitiesMock` | Hapus | Modul kamar dihapus |
| `room-on-request-facilities.mock.ts` | `handleRoomOnRequestFacilitiesMock` | Hapus | Modul kamar dihapus |
| `villa-class.mock.ts` | `handleVillaClassMock` | Ganti nama (`vehicle-category.mock.ts`) | Disesuaikan menjadi kategori Mobil & Motor dengan sub-kategori, stateful di localStorage |
| `room-type.mock.ts` | `handleRoomTypeMock` | Hapus | Modul kamar dihapus |
| `room-addon.mock.ts` | `handleRoomAddonMock` | Hapus | Modul kamar dihapus |
| `room-pricing.mock.ts` | `handleRoomPricingMock` | Hapus | Modul kamar dihapus |
| `package-tour.mock.ts` | `handlePackageTourMock` | Hapus | Modul tur dihapus |
| `promotion.mock.ts` | `handlePromotionMock` | Hapus | Modul promosi dihapus |
| `voucher.mock.ts` | `handleVoucherMock` | Hapus | Modul voucher dihapus |
| `activity.mock.ts` | `handleActivityMock` | Hapus | Modul CMS aktivitas dihapus |
| `download.mock.ts` | - | Hapus | Mock download report lama dihapus jika tidak dipakai |
| (baru) `reimburse.mock.ts` | `handleReimburseMock` | Baru | Mock data transaksi selesai untuk reimburse mitra, stateful di localStorage |
| (baru) `update.mock.ts` | `handleUpdateMock` | Baru / Pertahankan | Mock data audit log update |

---

## 3. Key di `src/constant/tags.ts` dan `src/constant/protectedRoutes.ts`

### 3.1 `src/constant/tags.ts`
- **Dihapus:**
  - `DINING`, `DINING_TYPE`
  - `VILLA_CLASS` (diganti `VEHICLE_CATEGORY`)
  - `ROOM_LAYOUT`, `ROOM_FACILITIES`, `ROOM_STATUS`, `ROOM`, `ROOM_ADDON`, `ROOM_ON_REQUEST_FACILITIES`, `ROOMS_AND_PRICING`, `ROOM_TYPE`
  - `VOUCHER`, `VOUCHER_CATEGORY`
  - `PACKAGE_TOUR`, `PACKAGE_TOUR_PRICING`
  - `PROMOTION`, `PROMOTION_CATEGORY`
  - `MEMBERSHIP_TIER`
  - `MEETING_EVENTS`, `MEETING_PACKAGES`, `MEETING_LAYOUTS`
  - `BOOKING_CHART_OVERVIEW`, `BOOKING_OVERVIEW`, `BUSINESS_OVERVIEW`, `PROMO_PERFORMANCE_CHART`, `CUSTOMER_DATA`
  - `BOOKING_REPORT`, `PAYMENT_REPORT`
  - `GALLERY`
  - `ACTIVITY`
- **Dipertahankan / Disesuaikan:**
  - `AUTH`
  - `STAFF` -> ganti ke `ADMIN`
  - `MEMBER` -> ganti ke `USER`
  - `ROLE` & `PERMISSIONS` -> pertahankan
  - `AGENT` -> ganti ke `MITRA`
  - `BOOKING` -> ganti ke `TRANSAKSI`
  - `ACTIVITY_LOG` -> ganti ke `UPDATE`
- **Baru:**
  - `VEHICLE_CATEGORY`
  - `REIMBURSE`
  - `RULES`
  - `MASTER`
  - `SUSPEND`

### 3.2 `src/constant/protectedRoutes.ts`
Disesuaikan penuh dengan struktur sidebar baru:
- `/dashboard/admin` (`admin`, `Read` / `Create` / `Update` / `Delete`)
- `/dashboard/user` (`user`, `Read` / `Create` / `Update` / `Delete`)
- `/dashboard/permission` (`permission`, `Read` / `Create` / `Update` / `Delete`)
- `/dashboard/mitra` (`mitra`, `Read` / `Create` / `Update` / `Delete`)
- `/dashboard/vehicle-category` (`vehicle_category`, `Read` / `Create` / `Update` / `Delete`)
- `/dashboard/master` (`master`, `Read`)
- `/dashboard/rules` (`rules`, `Read`)
- `/dashboard/transaksi` (`transaksi`, `Read` / `Update` / `Delete`)
- `/dashboard/reimburse` (`reimburse`, `Read` / `Create` / `Update`)
- `/dashboard/update` (`update`, `Read`)
- `/dashboard/suspend` (`suspend`, `Read`)

---

## 4. Key i18n di `src/locales/en.ts` dan `src/locales/id.ts` Terkait Modul Dihapus

Bagian i18n yang berkaitan dengan modul lama yang akan dihapus:
- Di `sidebar`:
  - `overview`, `analytics`, `rooms and pricing`, `room types`, `villa classes`, `villa class`, `facilities`, `room facilities`, `on request facilities`, `room on request facilities`, `room addons`, `booking report`, `payment report`, `package tour`, `package tour pricing`, `pricing`, `dining`, `dining type`, `meeting & events`, `meeting & event`, `meeting room`, `meeting layout`, `promo`, `promotion category`, `promo category`, `promo list`, `vouchers`, `voucher`, `voucher category`, `voucher list`, `gallery`.
- Di `dashboard`:
  - Seluruh sub-key `dashboard.*` (`bookingCountOverview`, `totalBookings`, `occupancyRate`, `promoPerformance`, `businessOverview`, `totalRooms`, `availableRooms`, `occupiedRooms`, `maintenanceRooms`, dll).
- Di `pages`:
  - Ratusan kunci yang merujuk pada:
    - Villa / room / addon / facility (`villa information`, `room type`, `room size`, `villa classes`, dll.)
    - Dining (`dining`, `dining type`, `table number`, dll.)
    - Meeting (`meeting event`, `meeting layout`, dll.)
    - Tour (`package tour`, `tour name`, dll.)
    - Voucher & Promo (`voucher name`, `promotion category`, dll.)
    - Reports (`download booking report`, `payment report`, dll.)
- Istilah yang harus dibersihkan: `villa`, `room`, `full_villa`, `villa_uuids`, `room_type`, `addon`, `dining`, `package_tour`, `voucher`, `promo`, `membership`, `checked_in`, `check_in`, `check_out`.

---

## 5. Cek `src/lib/types/*.type.ts` dan `src/lib/zustand/*.store.ts`

### 5.1 `src/lib/types/*.type.ts`

| File | Status | Analisis Pemakaian |
|---|---|---|
| `activity-log.type.ts` | Ganti nama (`update.type.ts`) | Dipakai di modul Update (sebelumnya activity-log) |
| `activity.type.ts` | Hapus | CMS Activity, hanya dipakai oleh modul activity lama |
| `agent.type.ts` | Ganti nama (`mitra.type.ts`) | Diadaptasi untuk MASTER MITRA (rekening, kontak, alamat, unit) |
| `auth.type.ts` | Pertahankan | Dipakai sesi login dan autentikasi admin |
| `booking-overview.type.ts` | Hapus | Hanya dipakai di dashboard analytics |
| `booking.type.ts` | Ganti nama (`transaksi.type.ts`) | Dirombak untuk status dan detail transaksi sewa Rentaku |
| `dashboard.type.ts` | Hapus | Hanya dipakai di dashboard analytics |
| `dining.type.ts` | Hapus | Hanya dipakai di dining |
| `gallery.type.ts` | Hapus | Hanya dipakai di gallery |
| `globals/index.d.ts` | Pertahankan | Berisi tipe umum `ResponseWrapperType`, `PaginationType`, dll. |
| `meeting-events.type.ts` | Hapus | Hanya dipakai di meeting-event |
| `meeting-layout.type.ts` | Hapus | Hanya dipakai di meeting-layout |
| `meeting-package.type.ts` | Hapus | Hanya dipakai di meeting-package |
| `package-tour.type.ts` | Hapus | Hanya dipakai di package tour |
| `permission.type.ts` | Pertahankan | Dipakai modul permission dan role |
| `promotion-category.type.ts` | Hapus | Hanya dipakai di promotion-category |
| `promotion.type.ts` | Hapus | Hanya dipakai di promotion |
| `reports/booking.type.ts` | Hapus | Hanya dipakai di booking-report |
| `reports/pament.type.ts` | Hapus | Hanya dipakai di payment-report |
| `role.type.ts` | Pertahankan | Dipakai oleh modul permission/role |
| `room-addon.type.ts` | Hapus | Hanya dipakai di room-addon |
| `room-facility.type.ts` | Hapus | Hanya dipakai di room-facilities |
| `room-layout.type.ts` | Hapus | Hanya dipakai di room-layout |
| `room-on-request-facility.type.ts` | Hapus | Hanya dipakai di room-on-request-facilities |
| `rooms-and-pricing.type.ts` | Hapus | Hanya dipakai di rooms-and-pricing |
| `room-type.type.ts` | Hapus | Hanya dipakai di room-type |
| `user.type.ts` | Pertahankan & Sesuaikan | Dipakai ADMIN dan USER |
| `villa-class.type.ts` | Ganti nama (`vehicle-category.type.ts`) | Diadaptasi untuk Kategori Kendaraan (Mobil, Motor, sub-kategori) |
| `voucher-category.type.ts` | Hapus | Hanya dipakai di voucher-category |
| `voucher.type.ts` | Hapus | Hanya dipakai di voucher |
| `reimburse.type.ts` | Baru | Tipe data untuk daftar & detail pembayaran reimburse ke mitra |

### 5.2 `src/lib/zustand/*.store.ts`

| File | Status | Analisis Pemakaian |
|---|---|---|
| `booking.store.ts` | Hapus | Hanya dipakai modal kalender booking lama yang dihapus |
| `package-tour-pricing.store.ts` | Hapus | Hanya dipakai kalender package tour lama |
| `rooms-and-pricing.store.ts` | Hapus | Hanya dipakai kalender room pricing lama |
| `locale.store.ts` | Pertahankan | Dipakai oleh i18n & `useTranslation` |
| `navigation.store.ts` | Pertahankan | Dipakai sidebar open/close state di seluruh layout |

---

## 6. Tabel Rangkuman Status Seluruh Berkas Terkait

| Berkas / Direktori | Status | Alasan |
|---|---|---|
| `src/app/dashboard/home/**` | Hapus | Modul analytics LaNadiya dihapus |
| `src/app/dashboard/room-*/**` | Hapus | Modul kamar & fasilitas dihapus |
| `src/app/dashboard/rooms-and-pricing/**` | Hapus | Modul kamar & harga dihapus |
| `src/app/dashboard/tour-management/**` | Hapus | Modul tur dihapus |
| `src/app/dashboard/dining*/**` | Hapus | Modul restoran dihapus |
| `src/app/dashboard/meeting-*/**` | Hapus | Modul meeting dihapus |
| `src/app/dashboard/promotion*/**` | Hapus | Modul promosi dihapus |
| `src/app/dashboard/voucher*/**` | Hapus | Modul voucher dihapus |
| `src/app/dashboard/gallery/**` | Hapus | Modul galeri dihapus |
| `src/app/dashboard/activity/**` | Hapus | Modul CMS aktivitas dihapus |
| `src/app/dashboard/booking-report/**` | Hapus | Laporan lama dihapus |
| `src/app/dashboard/payment-report/**` | Hapus | Dipindahkan menjadi pola REIMBURSE |
| `src/app/dashboard/staff/**` | Ganti nama -> `admin` | Modul akun Admin |
| `src/app/dashboard/member/**` | Ganti nama -> `user` | Modul akun Pelanggan/User |
| `src/app/dashboard/role/**` | Ganti nama -> `permission` | Modul Role & Permission Matrix |
| `src/app/dashboard/agent/**` | Ganti nama -> `mitra` | Modul MASTER MITRA |
| `src/app/dashboard/villa-class/**` | Ganti nama -> `vehicle-category` | Modul Kategori Kendaraan |
| `src/app/dashboard/booking/**` | Ganti nama -> `transaksi` | Modul Transaksi Sewa Rentaku |
| `src/app/dashboard/reimburse/**` | Baru | Modul Reimburse Pembayaran Mitra |
| `src/app/dashboard/activity-log/**` | Ganti nama -> `update` | Modul Riwayat Update Log |
| `src/app/dashboard/rules/**` | Baru | Placeholder "Segera hadir" |
| `src/app/dashboard/master/**` | Baru | Placeholder "Segera hadir" |
| `src/app/dashboard/suspend/**` | Baru | Placeholder "Segera hadir" |
| `src/services/booking.store.ts` & others | Hapus | Store tidak terpakai |
| `src/app/globals.css` | Sesuaikan | Palet warna Rentaku biru-putih |
| `src/lib/mui/theme.ts` | Sesuaikan | Tema MUI Rentaku (biru `#0053cd`, permukaan `#f7f9fb`) |
| `src/app/dashboard/_components/Sidebar/**` | Sesuaikan | Navigasi sesuai seksi 4 |
