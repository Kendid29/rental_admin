# Panduan Migrasi dari Mock API ke Backend Riil (Rentaku Admin)

Dokumen ini menjelaskan tata cara beralih dari mode data mock (stateful di `localStorage`) ke backend REST API produksi **tanpa mengubah satu baris pun kode pada komponen antarmuka (UI components)**.

---

## 1. Arsitektur Data Fetching

Web Admin Rentaku dirancang dengan pemisahan tanggung jawab yang ketat:
1. **Komponen UI**: Hanya memanggil custom hook TanStack Query (misalnya `useGetTransaksi`, `useConfirmTransaksi`, `useGetReimburses`).
2. **Service Hooks** (`src/services/<modul>/`): Membungkus mutation / query dan mendelegasikan panggilan HTTP ke `fetchHelper`.
3. **`fetchHelper`** (`src/services/fetchHelper.ts`): Satu-satunya pintu keluar permintaan jaringan yang memiliki saklar otomatis antara mock dan API riil.

```
+-------------------------------------------------------------+
|                     Komponen Antarmuka UI                   |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|         Service Hook (TanStack Query / useXxx.ts)           |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|             src/services/fetchHelper.ts                     |
+-------------------------------------------------------------+
               /                               \
              /                                 \
  (NEXT_PUBLIC_USE_MOCK_API=true)    (NEXT_PUBLIC_USE_MOCK_API=false)
            /                                     \
           v                                       v
+------------------------+             +----------------------+
| Mock Router &          |             | Backend Riil REST    |
| LocalStorage DB        |             | (NEXT_PUBLIC_API_URL)|
+------------------------+             +----------------------+
```

---

## 2. Langkah-Langkah Migrasi

### Langkah 1: Siapkan Environment Variables
Ubah berkas `.env` atau `.env.production`:

```env
# Matikan Mock API
NEXT_PUBLIC_USE_MOCK_API=false

# URL Endpoint Backend Produksi / Staging
NEXT_PUBLIC_API_URL=https://api.rentaku.id
NEXT_PUBLIC_API_VERSION=/v1

# Kunci Enkripsi Cookie Sesi
NEXT_PUBLIC_APP_KEY=base64:RentakuSecretKey32CharacterString!!
```

### Langkah 2: Mekanisme Autentikasi dan Token
- Saat login via `/auth/login`, token JWT yang dikembalikan backend akan disimpan dalam cookie aman dengan nama **`rk_token`**.
- Pada setiap request ke backend riil, `fetchHelper` secara otomatis menyisipkan header:
  ```http
  Authorization: Bearer <rk_token>
  Accept: application/json
  Content-Type: application/json
  ```
- Jika token kedaluwarsa atau terjadi respons `401 Unauthorized`, `fetchHelper` akan otomatis menghapus cookie dan mengarahkan pengguna ke halaman login (`/login`).

### Langkah 3: Verifikasi Keselarasan Kontrak Respons
Pastikan backend riil mengembalikan format respons yang sesuai dengan spesifikasi di [docs/API_CONTRACT.md](./API_CONTRACT.md):
- Untuk list paginated:
  ```json
  {
    "success": true,
    "message": "Success",
    "data": [ ... ],
    "pagination": {
      "data_per_page": 10,
      "total_page": 5,
      "total_data": 48
    }
  }
  ```
- Untuk operasi aksi/mutasi:
  ```json
  {
    "success": true,
    "message": "Pesan sukses",
    "data": { ... }
  }
  ```

---

## 3. Daftar Service Hooks & Endpoint Mapping

| Modul | Hook | Method & Path API Riil |
|---|---|---|
| **Admin** | `useGetAdmins` | `GET /auth/employee` |
| | `useGetAdmin` | `GET /auth/employee/:uuid` |
| | `useCreateAdmin` | `POST /auth/employee` |
| | `useUpdateAdmin` | `PUT /auth/employee/:uuid` |
| | `useDeleteAdmin` | `DELETE /auth/employee/:uuid` |
| **User** | `useGetUsers` | `GET /auth/member` |
| | `useGetUser` | `GET /auth/member/:uuid` |
| **Mitra** | `useGetMitras` | `GET /agent` |
| | `useGetMitra` | `GET /agent/:uuid` |
| | `useCreateMitra` | `POST /agent` |
| | `useUpdateMitra` | `PUT /agent/:uuid` |
| | `useDeleteMitra` | `DELETE /agent/:uuid` |
| **Vehicle Category** | `useGetVehicleCategories` | `GET /vehicle-category` |
| | `useGetVehicleCategory` | `GET /vehicle-category/:uuid` |
| | `useCreateVehicleCategory` | `POST /vehicle-category` |
| | `useUpdateVehicleCategory` | `PUT /vehicle-category/:uuid` |
| | `useDeleteVehicleCategory` | `DELETE /vehicle-category/:uuid` |
| **Transaksi** | `useGetBookings` | `GET /booking` |
| | `useGetBooking` | `GET /booking/:uuid` |
| | `useConfirmTransaksi` | `PUT /booking/:uuid/confirm` |
| | `useForwardTransaksi` | `PUT /booking/:uuid/forward` |
| | `useStartTransaksi` | `PUT /booking/:uuid/start` |
| | `useFinishTransaksi` | `PUT /booking/:uuid/finish` |
| | `useCancelTransaksi` | `PUT /booking/:uuid/cancel` |
| | `useCreateReimburse` | `POST /booking/:uuid/reimburse` |
| **Reimburse** | `useGetReimburses` | `GET /reimburse` |
| | `useGetReimburse` | `GET /reimburse/:uuid` |
| | `usePayReimburse` | `POST /reimburse/:uuid/pay` |
| **Update** | `useGetActivityLogs` | `GET /activity-log` |
| | `useGetActivityLog` | `GET /activity-log/:uuid` |

---

## 4. Pengujian Transisi

Sebelum merilis ke production:
1. Pastikan seluruh environment variable telah di-set pada server / deployment provider (misalnya Vercel / Docker container).
2. Jalankan build produksi:
   ```bash
   pnpm build
   ```
3. Mulai server:
   ```bash
   pnpm start
   ```
4. Verifikasi alur login dan alur transaksi end-to-end melalui Network tab browser untuk mengonfirmasi bahwa seluruh traffic mengarah ke `NEXT_PUBLIC_API_URL` dan tidak ada panggilan mock lokal yang dijalankan.
