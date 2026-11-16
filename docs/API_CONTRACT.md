# Kontrak API Web Admin Rentaku

Dokumen ini mendefinisikan spesifikasi API lengkap untuk seluruh modul Web Admin Rentaku. Seluruh pertukaran data melalui `fetchHelper` (`src/services/fetchHelper.ts`) dan hooks TanStack Query (`src/services/<modul>/useXxx.ts`).

---

## 1. Standar Respons API

### 1.1 Format Respons Sukses (Single / Non-Paginated)
```json
{
  "success": true,
  "message": "Operasi berhasil dilakukan",
  "data": { ... }
}
```

### 1.2 Format Respons Paginated
```json
{
  "success": true,
  "message": "Success",
  "data": [ ... ],
  "pagination": {
    "data_per_page": 10,
    "next_page": 2,
    "prev_page": 1,
    "first_page": 1,
    "last_page": 5,
    "next_page_url": "https://api.rentaku.id/v1/resource?page=2",
    "previous_page_url": "",
    "first_page_url": "https://api.rentaku.id/v1/resource?page=1",
    "last_page_url": "https://api.rentaku.id/v1/resource?page=5",
    "total_page": 5,
    "total_data": 48
  }
}
```

### 1.3 Format Respons Error
```json
{
  "success": false,
  "message": "Pesan deskripsi kesalahan yang mudah dipahami",
  "errors": {
    "email": ["Email sudah digunakan oleh akun lain"]
  }
}
```

---

## 2. Modul Autentikasi (`/auth`)

### 2.1 Login Admin
- **Method:** `POST`
- **Path:** `/auth/login`
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "admin@rentaku.id",
    "password": "PasswordRahasia123"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Login berhasil",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "def50200...",
      "user": {
        "uuid": "user-001",
        "name": "Super Admin Rentaku",
        "email": "admin@rentaku.id",
        "phone_number": "+628123456789",
        "role": {
          "uuid": "role-super-admin",
          "name": "Super Admin"
        }
      }
    }
  }
  ```
- **Error Codes:** `400 Bad Request`, `401 Unauthorized`.

### 2.2 Sesi Pengguna Aktif
- **Method:** `GET`
- **Path:** `/auth/user-session`
- **Request Headers:** `Authorization: Bearer <token>`
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "User session fetched",
    "data": {
      "uuid": "user-001",
      "name": "Super Admin Rentaku",
      "email": "admin@rentaku.id",
      "role": {
        "uuid": "role-super-admin",
        "name": "Super Admin"
      }
    }
  }
  ```

### 2.3 Logout
- **Method:** `POST`
- **Path:** `/auth/logout`
- **Request Headers:** `Authorization: Bearer <token>`
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Logout berhasil"
  }
  ```

---

## 3. Modul Admin / Staf (`/auth/employee`)

### 3.1 Daftar Staf Admin
- **Method:** `GET`
- **Path:** `/auth/employee`
- **Query Params:**
  - `page`: number (default: 1)
  - `per_page`: number (default: 10)
  - `search_param`: string
  - `role`: string (role uuid)
  - `status`: `'aktif' | 'tidak_aktif' | 'all'`
- **Response `200 OK`:** Array data admin dengan pagination.

### 3.2 Detail Admin
- **Method:** `GET`
- **Path:** `/auth/employee/:uuid`
- **Response `200 OK`:** Data detail admin.

### 3.3 Tambah Admin Baru
- **Method:** `POST`
- **Path:** `/auth/employee`
- **Request Body:**
  ```json
  {
    "name": "Budi Santoso",
    "email": "budi.ops@rentaku.id",
    "password": "Password123!",
    "password_confirmation": "Password123!",
    "phone_number": "+6281234567890",
    "role_uuid": "role-ops-manager",
    "status": "aktif"
  }
  ```

### 3.4 Perbarui Admin
- **Method:** `PUT`
- **Path:** `/auth/employee/:uuid`
- **Request Body:** Field yang ingin diperbarui beserta `version`.

### 3.5 Hapus Admin
- **Method:** `DELETE`
- **Path:** `/auth/employee/:uuid`
- **Request Body:** `{ "version": 1 }`

---

## 4. Modul Pengguna / Pelanggan (`/auth/member`)

### 4.1 Daftar User
- **Method:** `GET`
- **Path:** `/auth/member`
- **Query Params:** `page`, `per_page`, `search_param`, `status` (`'aktif' | 'tidak_aktif'`)
- **Response `200 OK`:** Paginated list user pelanggan.

### 4.2 Detail User & Riwayat Transaksi
- **Method:** `GET`
- **Path:** `/auth/member/:uuid`
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Detail user",
    "data": {
      "uuid": "member-001",
      "name": "Rina Kartika",
      "email": "rina.kartika@mail.com",
      "phone_number": "+628133333333",
      "status": "aktif",
      "transactions": [
        {
          "uuid": "tx-rentaku-0001",
          "booking_number": "RNT-2026-0001",
          "unit_name": "Toyota Avanza 1.5 G CVT",
          "period": "18 Apr 2026 - 20 Apr 2026",
          "total_amount": 700000,
          "status": "menunggu_konfirmasi"
        }
      ]
    }
  }
  ```

---

## 5. Modul Role & Permission (`/auth/role`, `/auth/permission`, `/auth/role-permission`)

### 5.1 Matriks Modul Permission
Modul yang terdaftar:
`admin`, `user`, `permission`, `mitra`, `vehicle_category`, `master`, `rules`, `transaksi`, `reimburse`, `update`, `suspend`.

Setiap modul memiliki 4 aksi:
- `Create`: boolean
- `Read`: boolean
- `Update`: boolean
- `Delete`: boolean

### 5.2 Ambil Matriks Permission Role
- **Method:** `GET`
- **Path:** `/auth/role-permission/:roleUuid`

### 5.3 Perbarui Permission Role
- **Method:** `PUT`
- **Path:** `/auth/role-permission/:roleUuid`
- **Request Body:** Array objek per modul:
  ```json
  [
    {
      "module_name": "transaksi",
      "accesses": [{ "Create": true, "Read": true, "Update": true, "Delete": false }]
    }
  ]
  ```

---

## 6. Modul Mitra / Master Mitra (`/agent`)

### 6.1 Daftar Mitra
- **Method:** `GET`
- **Path:** `/agent`
- **Query Params:** `page`, `per_page`, `search_param`, `city`, `cooperation_status`
- **Response `200 OK`:** Paginated data mitra dengan daftar unit milik mitra dan informasi rekening bank.

### 6.2 Detail Mitra
- **Method:** `GET`
- **Path:** `/agent/:uuid`
- **Response `200 OK`:** Data lengkap mitra, daftar unit kendaraan/barang milik mitra, dan detail rekening bank untuk reimburse.

### 6.3 Tambah Mitra
- **Method:** `POST`
- **Path:** `/agent`
- **Request Body:**
  ```json
  {
    "name": "Budi Santoso",
    "company": "PT Berkah Rental Nusantara",
    "email": "kontak@berkahrental.co.id",
    "phone_number": "+628122334455",
    "city": "Jakarta Selatan",
    "address": "Jl. TB Simatupang No. 88",
    "cooperation_status": "aktif",
    "bank_name": "BCA",
    "bank_account_number": "1234567890",
    "bank_account_holder": "PT Berkah Rental Nusantara"
  }
  ```

---

## 7. Modul Vehicle Category (`/vehicle-category`)

### 7.1 Daftar Kategori Kendaraan
- **Method:** `GET`
- **Path:** `/vehicle-category`
- **Query Params:** `search`, `type` (`mobil` | `motor` | `barang`), `is_active`
- **Response `200 OK`:** Kategori utama (Mobil, Motor, Barang & Peralatan) beserta sub-kategori (MPV, SUV, Sedan, Matic, Sport, Kamera, dll).

### 7.2 Tambah Kategori
- **Method:** `POST`
- **Path:** `/vehicle-category`

### 7.3 Perbarui Kategori
- **Method:** `PUT`
- **Path:** `/vehicle-category/:uuid`

### 7.4 Hapus Kategori
- **Method:** `DELETE`
- **Path:** `/vehicle-category/:uuid`

---

## 8. Modul Transaksi Sewa (`/booking`)

### 8.1 Daftar Transaksi
- **Method:** `GET`
- **Path:** `/booking`
- **Query Params:**
  - `page`: number
  - `per_page`: number
  - `search_param`: string (kode transaksi, nama user, nama unit, mitra)
  - `status`: `'menunggu_konfirmasi' | 'terkonfirmasi' | 'diteruskan_mitra' | 'berjalan' | 'selesai' | 'dibatalkan'`
  - `city`: string
  - `check_in`: string (tanggal sewa YYYY-MM-DD)
  - `agent_uuid`: string (mitra uuid)

### 8.2 Detail Transaksi
- **Method:** `GET`
- **Path:** `/booking/:uuid`
- **Response `200 OK`:** TransaksiType lengkap meliputi:
  - Data Unit Rental (`uuid`, `name`, `category`, `plate_number`, `price_per_day`)
  - Data Penyewa (`uuid`, `name`, `email`, `phone_number`)
  - Data Mitra Pemilik Unit (`uuid`, `name`, `company`, `bank_name`, `bank_account_number`, `bank_account_holder`)
  - Periode Sewa (`check_in`, `check_out`, `duration`)
  - Rincian Biaya (`subtotal`, `discount`, `grand_total`, `payment_type`)
  - Riwayat Status / Timeline (`status`, `label`, `timestamp`, `actor`, `notes`)
  - Status Reimburse (`reimburse_status`: `'belum_dibayar' | 'sudah_dibayar' | 'tidak_ada'`)

### 8.3 Konfirmasi Pembayaran
- **Method:** `PUT`
- **Path:** `/booking/:uuid/confirm`
- **Payload:** `{ "notes": string }`
- **Transisi Status:** `menunggu_konfirmasi` -> `terkonfirmasi`

### 8.4 Teruskan ke Mitra
- **Method:** `PUT`
- **Path:** `/booking/:uuid/forward`
- **Payload:** `{ "notes": string }`
- **Transisi Status:** `terkonfirmasi` -> `diteruskan_mitra`

### 8.5 Mulai Sewa (Serah Terima Unit)
- **Method:** `PUT`
- **Path:** `/booking/:uuid/start`
- **Payload:** `{ "notes": string }`
- **Transisi Status:** `diteruskan_mitra` -> `berjalan`

### 8.6 Selesai Sewa (Unit Kembali)
- **Method:** `PUT`
- **Path:** `/booking/:uuid/finish`
- **Payload:** `{ "notes": string }`
- **Transisi Status:** `berjalan` -> `selesai` (secara otomatis mengaktifkan hak klaim reimburse)

### 8.7 Batalkan Transaksi
- **Method:** `PUT`
- **Path:** `/booking/:uuid/cancel`
- **Payload:** `{ "notes": string }`
- **Transisi Status:** Status apa pun sebelum selesai -> `dibatalkan`

### 8.8 Ajukan / Buat Reimburse Mitra
- **Method:** `POST`
- **Path:** `/booking/:uuid/reimburse`
- **Syarat:** Transaksi berstatus `selesai`
- **Transisi:** Mendaftarkan record reimburse mitra berstatus `belum_dibayar`.

---

## 9. Modul Reimburse (`/reimburse`)

### 9.1 Daftar Pembayaran Reimburse ke Mitra
- **Method:** `GET`
- **Path:** `/reimburse`
- **Query Params:**
  - `page`: number
  - `page_size`: number
  - `search`: string (kode transaksi, nama mitra, nama unit)
  - `status`: `'belum_dibayar' | 'sudah_dibayar' | 'all'`

### 9.2 Detail Reimburse
- **Method:** `GET`
- **Path:** `/reimburse/:uuid`
- **Response `200 OK`:** Data reimburse lengkap meliputi rincian nominal sewa, potongan komisi platform, rekening bank tujuan mitra, dan data bukti transfer jika sudah dibayar.

### 9.3 Tandai Reimburse Sudah Dibayar
- **Method:** `POST`
- **Path:** `/reimburse/:uuid/pay`
- **Request Body:**
  ```json
  {
    "payment_date": "2026-04-18",
    "transfer_reference": "TRX-BCA-98127391",
    "transfer_proof_url": "https://storage.rentaku.id/proofs/trx-98127391.png",
    "notes": "Transfer berhasil melalui KlikBCA Bisnis."
  }
  ```
- **Response `200 OK`:** Record reimburse yang telah berstatus `sudah_dibayar`.

---

## 10. Modul Update / Log Audit (`/activity-log`)

### 10.1 Daftar Log Aktivitas
- **Method:** `GET`
- **Path:** `/activity-log`
- **Query Params:**
  - `page`: number
  - `per_page`: number
  - `search_param`: string
  - `module`: string (`transaksi`, `mitra`, `vehicle_category`, `reimburse`, `admin`, `user`)
  - `action`: `'created' | 'updated' | 'deleted'`
- **Response `200 OK`:** Paginated audit trail data.

### 10.2 Detail Log Aktivitas
- **Method:** `GET`
- **Path:** `/activity-log/:uuid`
- **Response `200 OK`:** Log detail termasuk payload request, IP, user-agent, dan `changes` (objek `old` dan `new`).
