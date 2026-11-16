import { BookingType, TransaksiStatus } from '@/lib/types/booking.type';

import { createSuccessResponse } from './common';
import { loadFromStorage, saveToStorage } from './storage';
import { MockRequestContext, MockResult } from './types';

const defaultBookings: BookingType[] = [
  {
    uuid: 'trx-001',
    booking_number: 'TRX-2026-001',
    booking_date: '2026-04-18T09:30:00Z',
    status: {
      label: 'Menunggu Konfirmasi',
      value: 'menunggu_konfirmasi',
    },
    check_in: '2026-04-20',
    check_out: '2026-04-22',
    duration: 2,
    total_payment: 700000,
    total_discount: 0,
    payment_type: 'Transfer Bank (BCA Virtual Account)',
    user: {
      uuid: 'member-001',
      name: 'Rina Kartika',
      email: 'rina.kartika@mail.com',
      phone_number: '+628133333333',
    },
    guest_info: {
      name: 'Rina Kartika',
      email: 'rina.kartika@mail.com',
      phone_number: '+628133333333',
    },
    unit: {
      uuid: 'unit-001',
      name: 'Toyota Avanza 1.5 G CVT',
      category: 'Mobil',
      plate_number: 'D 1452 ABC',
      price_per_day: 350000,
    },
    mitra: {
      uuid: 'mitra-001',
      name: 'Berkah Rental Mobil Bandung',
      company: 'PT Berkah Rental Nusantara',
      city: 'Bandung',
      phone_number: '+628122334455',
      bank_name: 'BCA',
      bank_account_number: '1234567890',
      bank_account_holder: 'PT Berkah Rental Nusantara',
    },
    timeline: [
      {
        status: 'menunggu_konfirmasi',
        label: 'Pesanan Dibuat',
        timestamp: '2026-04-18T09:30:00Z',
        actor: 'Rina Kartika (Penyewa)',
        notes: 'Penyewa telah mengunggah bukti pembayaran',
      },
    ],
    version: 1,
    rooms: [
      {
        uuid: 'r-001',
        quantity: 1,
        price: 350000,
        total_price: 700000,
        room_type: { uuid: 'rt-1', name: 'Toyota Avanza 1.5 G CVT' },
        addons: [],
        is_cancellable: true,
        per_night_promos: [],
      },
    ],
  },
  {
    uuid: 'trx-002',
    booking_number: 'TRX-2026-002',
    booking_date: '2026-04-18T10:15:00Z',
    status: {
      label: 'Menunggu Konfirmasi',
      value: 'menunggu_konfirmasi',
    },
    check_in: '2026-04-21',
    check_out: '2026-04-24',
    duration: 3,
    total_payment: 360000,
    total_discount: 0,
    payment_type: 'Transfer Bank (Mandiri)',
    user: {
      uuid: 'member-002',
      name: 'Andi Prasetyo',
      email: 'andi.prasetyo@mail.com',
      phone_number: '+628144444444',
    },
    guest_info: {
      name: 'Andi Prasetyo',
      email: 'andi.prasetyo@mail.com',
      phone_number: '+628144444444',
    },
    unit: {
      uuid: 'unit-006',
      name: 'Honda PCX 160 ABS',
      category: 'Motor',
      plate_number: 'B 9012 KLL',
      price_per_day: 120000,
    },
    mitra: {
      uuid: 'mitra-002',
      name: 'Nusantara Trans Jakarta',
      company: 'CV Nusantara Transindo',
      city: 'Jakarta',
      phone_number: '+6281399887766',
      bank_name: 'Mandiri',
      bank_account_number: '1370012345678',
      bank_account_holder: 'CV Nusantara Transindo',
    },
    timeline: [
      {
        status: 'menunggu_konfirmasi',
        label: 'Pesanan Dibuat',
        timestamp: '2026-04-18T10:15:00Z',
        actor: 'Andi Prasetyo (Penyewa)',
        notes: 'Menunggu verifikasi admin',
      },
    ],
    version: 1,
    rooms: [
      {
        uuid: 'r-002',
        quantity: 1,
        price: 120000,
        total_price: 360000,
        room_type: { uuid: 'rt-2', name: 'Honda PCX 160 ABS' },
        addons: [],
        is_cancellable: true,
        per_night_promos: [],
      },
    ],
  },
  {
    uuid: 'trx-003',
    booking_number: 'TRX-2026-003',
    booking_date: '2026-04-17T14:20:00Z',
    status: {
      label: 'Terkonfirmasi',
      value: 'terkonfirmasi',
    },
    check_in: '2026-04-22',
    check_out: '2026-04-25',
    duration: 3,
    total_payment: 2850000,
    total_discount: 0,
    payment_type: 'Transfer Bank (BCA)',
    user: {
      uuid: 'member-003',
      name: 'Maya Lestari',
      email: 'maya.lestari@mail.com',
      phone_number: '+628155555555',
    },
    guest_info: {
      name: 'Maya Lestari',
      email: 'maya.lestari@mail.com',
      phone_number: '+628155555555',
    },
    unit: {
      uuid: 'unit-004',
      name: 'Mitsubishi Pajero Sport Dakar 4x2',
      category: 'Mobil',
      plate_number: 'B 1234 SSB',
      price_per_day: 950000,
    },
    mitra: {
      uuid: 'mitra-002',
      name: 'Nusantara Trans Jakarta',
      company: 'CV Nusantara Transindo',
      city: 'Jakarta',
      phone_number: '+6281399887766',
      bank_name: 'Mandiri',
      bank_account_number: '1370012345678',
      bank_account_holder: 'CV Nusantara Transindo',
    },
    timeline: [
      {
        status: 'menunggu_konfirmasi',
        label: 'Pesanan Dibuat',
        timestamp: '2026-04-17T14:20:00Z',
        actor: 'Maya Lestari (Penyewa)',
      },
      {
        status: 'terkonfirmasi',
        label: 'Pembayaran Dikonfirmasi',
        timestamp: '2026-04-17T15:00:00Z',
        actor: 'Admin Rentaku',
        notes: 'Bukti transfer valid dan dana telah masuk.',
      },
    ],
    version: 2,
    rooms: [
      {
        uuid: 'r-003',
        quantity: 1,
        price: 950000,
        total_price: 2850000,
        room_type: { uuid: 'rt-3', name: 'Mitsubishi Pajero Sport' },
        addons: [],
        is_cancellable: true,
        per_night_promos: [],
      },
    ],
  },
  {
    uuid: 'trx-004',
    booking_number: 'TRX-2026-004',
    booking_date: '2026-04-17T16:40:00Z',
    status: {
      label: 'Terkonfirmasi',
      value: 'terkonfirmasi',
    },
    check_in: '2026-04-20',
    check_out: '2026-04-22',
    duration: 2,
    total_payment: 600000,
    total_discount: 0,
    payment_type: 'QRIS',
    user: {
      uuid: 'member-004',
      name: 'Budi Pratama',
      email: 'budi.pratama@mail.com',
      phone_number: '+6281277665544',
    },
    guest_info: {
      name: 'Budi Pratama',
      email: 'budi.pratama@mail.com',
      phone_number: '+6281277665544',
    },
    unit: {
      uuid: 'unit-002',
      name: 'Honda Brio RS 2023',
      category: 'Mobil',
      plate_number: 'D 1899 XYZ',
      price_per_day: 300000,
    },
    mitra: {
      uuid: 'mitra-001',
      name: 'Berkah Rental Mobil Bandung',
      company: 'PT Berkah Rental Nusantara',
      city: 'Bandung',
      phone_number: '+628122334455',
      bank_name: 'BCA',
      bank_account_number: '1234567890',
      bank_account_holder: 'PT Berkah Rental Nusantara',
    },
    timeline: [
      {
        status: 'menunggu_konfirmasi',
        label: 'Pesanan Dibuat',
        timestamp: '2026-04-17T16:40:00Z',
        actor: 'Budi Pratama (Penyewa)',
      },
      {
        status: 'terkonfirmasi',
        label: 'Pembayaran QRIS Terverifikasi',
        timestamp: '2026-04-17T16:45:00Z',
        actor: 'Sistem Pembayaran',
      },
    ],
    version: 2,
    rooms: [
      {
        uuid: 'r-004',
        quantity: 1,
        price: 300000,
        total_price: 600000,
        room_type: { uuid: 'rt-4', name: 'Honda Brio RS 2023' },
        addons: [],
        is_cancellable: true,
        per_night_promos: [],
      },
    ],
  },
  {
    uuid: 'trx-005',
    booking_number: 'TRX-2026-005',
    booking_date: '2026-04-16T11:00:00Z',
    status: {
      label: 'Diteruskan ke Mitra',
      value: 'diteruskan_mitra',
    },
    check_in: '2026-04-19',
    check_out: '2026-04-22',
    duration: 3,
    total_payment: 330000,
    total_discount: 0,
    payment_type: 'Transfer Bank (BRI)',
    user: {
      uuid: 'member-005',
      name: 'Siti Aisyah',
      email: 'siti.aisyah@mail.com',
      phone_number: '+6281311223344',
    },
    guest_info: {
      name: 'Siti Aisyah',
      email: 'siti.aisyah@mail.com',
      phone_number: '+6281311223344',
    },
    unit: {
      uuid: 'unit-007',
      name: 'Yamaha NMAX 155 Connected',
      category: 'Motor',
      plate_number: 'L 4567 GH',
      price_per_day: 110000,
    },
    mitra: {
      uuid: 'mitra-003',
      name: 'Surabaya Motor Rental',
      city: 'Surabaya',
      phone_number: '+6281566778899',
      bank_name: 'BRI',
      bank_account_number: '001201004567509',
      bank_account_holder: 'Hendra Gunawan',
    },
    timeline: [
      {
        status: 'menunggu_konfirmasi',
        label: 'Pesanan Dibuat',
        timestamp: '2026-04-16T11:00:00Z',
        actor: 'Siti Aisyah (Penyewa)',
      },
      {
        status: 'terkonfirmasi',
        label: 'Pembayaran Dikonfirmasi',
        timestamp: '2026-04-16T11:30:00Z',
        actor: 'Admin Rentaku',
      },
      {
        status: 'diteruskan_mitra',
        label: 'Diteruskan ke Mitra Pemilik',
        timestamp: '2026-04-16T12:00:00Z',
        actor: 'Admin Rentaku',
        notes: 'Mitra telah menerima notifikasi penyiapan unit.',
      },
    ],
    version: 3,
    rooms: [
      {
        uuid: 'r-005',
        quantity: 1,
        price: 110000,
        total_price: 330000,
        room_type: { uuid: 'rt-5', name: 'Yamaha NMAX 155 Connected' },
        addons: [],
        is_cancellable: true,
        per_night_promos: [],
      },
    ],
  },
  {
    uuid: 'trx-006',
    booking_number: 'TRX-2026-006',
    booking_date: '2026-04-16T13:45:00Z',
    status: {
      label: 'Diteruskan ke Mitra',
      value: 'diteruskan_mitra',
    },
    check_in: '2026-04-19',
    check_out: '2026-04-22',
    duration: 3,
    total_payment: 1950000,
    total_discount: 0,
    payment_type: 'Transfer Bank (BCA)',
    user: {
      uuid: 'member-006',
      name: 'Eko Kurniawan',
      email: 'eko.kurniawan@mail.com',
      phone_number: '+6281988776655',
    },
    guest_info: {
      name: 'Eko Kurniawan',
      email: 'eko.kurniawan@mail.com',
      phone_number: '+6281988776655',
    },
    unit: {
      uuid: 'unit-003',
      name: 'Toyota Innova Zenix 2.0 V',
      category: 'Mobil',
      plate_number: 'D 1100 ZZZ',
      price_per_day: 650000,
    },
    mitra: {
      uuid: 'mitra-001',
      name: 'Berkah Rental Mobil Bandung',
      company: 'PT Berkah Rental Nusantara',
      city: 'Bandung',
      phone_number: '+628122334455',
      bank_name: 'BCA',
      bank_account_number: '1234567890',
      bank_account_holder: 'PT Berkah Rental Nusantara',
    },
    timeline: [
      {
        status: 'menunggu_konfirmasi',
        label: 'Pesanan Dibuat',
        timestamp: '2026-04-16T13:45:00Z',
        actor: 'Eko Kurniawan',
      },
      {
        status: 'terkonfirmasi',
        label: 'Pembayaran Dikonfirmasi',
        timestamp: '2026-04-16T14:10:00Z',
        actor: 'Admin Rentaku',
      },
      {
        status: 'diteruskan_mitra',
        label: 'Diteruskan ke Mitra',
        timestamp: '2026-04-16T14:30:00Z',
        actor: 'Admin Rentaku',
      },
    ],
    version: 3,
    rooms: [
      {
        uuid: 'r-006',
        quantity: 1,
        price: 650000,
        total_price: 1950000,
        room_type: { uuid: 'rt-6', name: 'Toyota Innova Zenix 2.0 V' },
        addons: [],
        is_cancellable: true,
        per_night_promos: [],
      },
    ],
  },
  {
    uuid: 'trx-007',
    booking_number: 'TRX-2026-007',
    booking_date: '2026-04-14T08:00:00Z',
    status: {
      label: 'Mulai Sewa / Berjalan',
      value: 'berjalan',
    },
    check_in: '2026-04-15',
    check_out: '2026-04-18',
    duration: 3,
    total_payment: 1200000,
    total_discount: 0,
    payment_type: 'Transfer Bank (Mandiri)',
    user: {
      uuid: 'member-001',
      name: 'Rina Kartika',
      email: 'rina.kartika@mail.com',
      phone_number: '+628133333333',
    },
    guest_info: {
      name: 'Rina Kartika',
      email: 'rina.kartika@mail.com',
      phone_number: '+628133333333',
    },
    unit: {
      uuid: 'unit-005',
      name: 'Hyundai Stargazer Prime',
      category: 'Mobil',
      plate_number: 'B 5678 RFS',
      price_per_day: 400000,
    },
    mitra: {
      uuid: 'mitra-002',
      name: 'Nusantara Trans Jakarta',
      company: 'CV Nusantara Transindo',
      city: 'Jakarta',
      phone_number: '+6281399887766',
      bank_name: 'Mandiri',
      bank_account_number: '1370012345678',
      bank_account_holder: 'CV Nusantara Transindo',
    },
    timeline: [
      {
        status: 'menunggu_konfirmasi',
        label: 'Pesanan Dibuat',
        timestamp: '2026-04-14T08:00:00Z',
        actor: 'Rina Kartika',
      },
      {
        status: 'terkonfirmasi',
        label: 'Pembayaran Dikonfirmasi',
        timestamp: '2026-04-14T08:30:00Z',
        actor: 'Admin Rentaku',
      },
      {
        status: 'diteruskan_mitra',
        label: 'Diteruskan ke Mitra',
        timestamp: '2026-04-14T09:00:00Z',
        actor: 'Admin Rentaku',
      },
      {
        status: 'berjalan',
        label: 'Mulai Sewa (Unit Diserahkan)',
        timestamp: '2026-04-15T09:15:00Z',
        actor: 'Mitra Nusantara Trans Jakarta',
        notes: 'Kondisi kendaraan mulus, checklist serah terima ditandatangani.',
      },
    ],
    version: 4,
    rooms: [
      {
        uuid: 'r-007',
        quantity: 1,
        price: 400000,
        total_price: 1200000,
        room_type: { uuid: 'rt-7', name: 'Hyundai Stargazer Prime' },
        addons: [],
        is_cancellable: false,
        per_night_promos: [],
      },
    ],
  },
  {
    uuid: 'trx-008',
    booking_number: 'TRX-2026-008',
    booking_date: '2026-04-15T10:00:00Z',
    status: {
      label: 'Mulai Sewa / Berjalan',
      value: 'berjalan',
    },
    check_in: '2026-04-16',
    check_out: '2026-04-19',
    duration: 3,
    total_payment: 285000,
    total_discount: 0,
    payment_type: 'QRIS',
    user: {
      uuid: 'member-007',
      name: 'Dedi Suryadi',
      email: 'dedi.suryadi@mail.com',
      phone_number: '+6281765432109',
    },
    guest_info: {
      name: 'Dedi Suryadi',
      email: 'dedi.suryadi@mail.com',
      phone_number: '+6281765432109',
    },
    unit: {
      uuid: 'unit-008',
      name: 'Honda Vario 160 CBS',
      category: 'Motor',
      plate_number: 'L 6789 JK',
      price_per_day: 95000,
    },
    mitra: {
      uuid: 'mitra-003',
      name: 'Surabaya Motor Rental',
      city: 'Surabaya',
      phone_number: '+6281566778899',
      bank_name: 'BRI',
      bank_account_number: '001201004567509',
      bank_account_holder: 'Hendra Gunawan',
    },
    timeline: [
      {
        status: 'menunggu_konfirmasi',
        label: 'Pesanan Dibuat',
        timestamp: '2026-04-15T10:00:00Z',
        actor: 'Dedi Suryadi',
      },
      {
        status: 'terkonfirmasi',
        label: 'Pembayaran Dikonfirmasi',
        timestamp: '2026-04-15T10:05:00Z',
        actor: 'Sistem Pembayaran',
      },
      {
        status: 'diteruskan_mitra',
        label: 'Diteruskan ke Mitra',
        timestamp: '2026-04-15T10:30:00Z',
        actor: 'Admin Rentaku',
      },
      {
        status: 'berjalan',
        label: 'Mulai Sewa (Unit Diserahkan)',
        timestamp: '2026-04-16T08:30:00Z',
        actor: 'Mitra Surabaya Motor',
        notes: '2 helm SNI dan 1 jas hujan diserahkan.',
      },
    ],
    version: 4,
    rooms: [
      {
        uuid: 'r-008',
        quantity: 1,
        price: 95000,
        total_price: 285000,
        room_type: { uuid: 'rt-8', name: 'Honda Vario 160 CBS' },
        addons: [],
        is_cancellable: false,
        per_night_promos: [],
      },
    ],
  },
  {
    uuid: 'trx-009',
    booking_number: 'TRX-2026-009',
    booking_date: '2026-04-10T09:00:00Z',
    status: {
      label: 'Selesai',
      value: 'selesai',
    },
    check_in: '2026-04-11',
    check_out: '2026-04-14',
    duration: 3,
    total_payment: 1050000,
    total_discount: 0,
    payment_type: 'Transfer Bank (BCA)',
    user: {
      uuid: 'member-002',
      name: 'Andi Prasetyo',
      email: 'andi.prasetyo@mail.com',
      phone_number: '+628144444444',
    },
    guest_info: {
      name: 'Andi Prasetyo',
      email: 'andi.prasetyo@mail.com',
      phone_number: '+628144444444',
    },
    unit: {
      uuid: 'unit-001',
      name: 'Toyota Avanza 1.5 G CVT',
      category: 'Mobil',
      plate_number: 'D 1452 ABC',
      price_per_day: 350000,
    },
    mitra: {
      uuid: 'mitra-001',
      name: 'Berkah Rental Mobil Bandung',
      company: 'PT Berkah Rental Nusantara',
      city: 'Bandung',
      phone_number: '+628122334455',
      bank_name: 'BCA',
      bank_account_number: '1234567890',
      bank_account_holder: 'PT Berkah Rental Nusantara',
    },
    reimburse_status: 'belum_dibayar',
    timeline: [
      {
        status: 'menunggu_konfirmasi',
        label: 'Pesanan Dibuat',
        timestamp: '2026-04-10T09:00:00Z',
        actor: 'Andi Prasetyo',
      },
      {
        status: 'terkonfirmasi',
        label: 'Pembayaran Dikonfirmasi',
        timestamp: '2026-04-10T09:20:00Z',
        actor: 'Admin Rentaku',
      },
      {
        status: 'diteruskan_mitra',
        label: 'Diteruskan ke Mitra',
        timestamp: '2026-04-10T10:00:00Z',
        actor: 'Admin Rentaku',
      },
      {
        status: 'berjalan',
        label: 'Mulai Sewa',
        timestamp: '2026-04-11T09:00:00Z',
        actor: 'Mitra Berkah Rental',
      },
      {
        status: 'selesai',
        label: 'Selesai Sewa (Unit Dikembalikan)',
        timestamp: '2026-04-14T17:30:00Z',
        actor: 'Mitra Berkah Rental',
        notes: 'Unit diterima dalam kondisi baik tanpa denda.',
      },
    ],
    version: 5,
    rooms: [
      {
        uuid: 'r-009',
        quantity: 1,
        price: 350000,
        total_price: 1050000,
        room_type: { uuid: 'rt-1', name: 'Toyota Avanza 1.5 G CVT' },
        addons: [],
        is_cancellable: false,
        per_night_promos: [],
      },
    ],
  },
  {
    uuid: 'trx-010',
    booking_number: 'TRX-2026-010',
    booking_date: '2026-04-08T14:00:00Z',
    status: {
      label: 'Selesai',
      value: 'selesai',
    },
    check_in: '2026-04-09',
    check_out: '2026-04-12',
    duration: 3,
    total_payment: 225000,
    total_discount: 0,
    payment_type: 'Transfer Bank (BCA)',
    user: {
      uuid: 'member-008',
      name: 'Fitri Handayani',
      email: 'fitri.handayani@mail.com',
      phone_number: '+6281899001122',
    },
    guest_info: {
      name: 'Fitri Handayani',
      email: 'fitri.handayani@mail.com',
      phone_number: '+6281899001122',
    },
    unit: {
      uuid: 'unit-010',
      name: 'Paket Camping Tenda 4 Person + Matras',
      category: 'Barang',
      price_per_day: 75000,
    },
    mitra: {
      uuid: 'mitra-005',
      name: 'Yogya Adventure Gear',
      company: 'Yogya Adventure Gear',
      city: 'Yogyakarta',
      phone_number: '+6281800112233',
      bank_name: 'BCA',
      bank_account_number: '4560987654',
      bank_account_holder: 'Agus Wibowo',
    },
    reimburse_status: 'sudah_dibayar',
    timeline: [
      {
        status: 'menunggu_konfirmasi',
        label: 'Pesanan Dibuat',
        timestamp: '2026-04-08T14:00:00Z',
        actor: 'Fitri Handayani',
      },
      {
        status: 'terkonfirmasi',
        label: 'Pembayaran Dikonfirmasi',
        timestamp: '2026-04-08T14:30:00Z',
        actor: 'Admin Rentaku',
      },
      {
        status: 'diteruskan_mitra',
        label: 'Diteruskan ke Mitra',
        timestamp: '2026-04-08T15:00:00Z',
        actor: 'Admin Rentaku',
      },
      {
        status: 'berjalan',
        label: 'Mulai Sewa (Barang Diambil)',
        timestamp: '2026-04-09T10:00:00Z',
        actor: 'Mitra Yogya Adventure',
      },
      {
        status: 'selesai',
        label: 'Selesai Sewa (Barang Dikembalikan)',
        timestamp: '2026-04-12T16:00:00Z',
        actor: 'Mitra Yogya Adventure',
        notes: 'Peralatan lengkap dan bersih.',
      },
    ],
    version: 5,
    rooms: [
      {
        uuid: 'r-010',
        quantity: 1,
        price: 75000,
        total_price: 225000,
        room_type: { uuid: 'rt-10', name: 'Paket Camping Tenda 4 Person' },
        addons: [],
        is_cancellable: false,
        per_night_promos: [],
      },
    ],
  },
  {
    uuid: 'trx-011',
    booking_number: 'TRX-2026-011',
    booking_date: '2026-04-05T10:00:00Z',
    status: {
      label: 'Selesai',
      value: 'selesai',
    },
    check_in: '2026-04-06',
    check_out: '2026-04-09',
    duration: 3,
    total_payment: 3300000,
    total_discount: 0,
    payment_type: 'Transfer Bank (BNI)',
    user: {
      uuid: 'member-009',
      name: 'Rian Hidayat',
      email: 'rian.hidayat@mail.com',
      phone_number: '+6281900112233',
    },
    guest_info: {
      name: 'Rian Hidayat',
      email: 'rian.hidayat@mail.com',
      phone_number: '+6281900112233',
    },
    unit: {
      uuid: 'unit-009',
      name: 'Toyota Hiace Commuter 16 Seat',
      category: 'Mobil',
      plate_number: 'DK 7890 AA',
      price_per_day: 1100000,
    },
    mitra: {
      uuid: 'mitra-004',
      name: 'Bali Jaya Abadi Transport',
      company: 'PT Bali Jaya Abadi',
      city: 'Denpasar',
      phone_number: '+6281788990011',
      bank_name: 'BNI',
      bank_account_number: '0891234567',
      bank_account_holder: 'I Made Suartana',
    },
    reimburse_status: 'belum_dibayar',
    timeline: [
      {
        status: 'menunggu_konfirmasi',
        label: 'Pesanan Dibuat',
        timestamp: '2026-04-05T10:00:00Z',
        actor: 'Rian Hidayat',
      },
      {
        status: 'terkonfirmasi',
        label: 'Pembayaran Dikonfirmasi',
        timestamp: '2026-04-05T10:25:00Z',
        actor: 'Admin Rentaku',
      },
      {
        status: 'diteruskan_mitra',
        label: 'Diteruskan ke Mitra',
        timestamp: '2026-04-05T11:00:00Z',
        actor: 'Admin Rentaku',
      },
      {
        status: 'berjalan',
        label: 'Mulai Sewa',
        timestamp: '2026-04-06T08:00:00Z',
        actor: 'Mitra Bali Jaya Abadi',
      },
      {
        status: 'selesai',
        label: 'Selesai Sewa',
        timestamp: '2026-04-09T18:00:00Z',
        actor: 'Mitra Bali Jaya Abadi',
      },
    ],
    version: 5,
    rooms: [
      {
        uuid: 'r-011',
        quantity: 1,
        price: 1100000,
        total_price: 3300000,
        room_type: { uuid: 'rt-9', name: 'Toyota Hiace Commuter' },
        addons: [],
        is_cancellable: false,
        per_night_promos: [],
      },
    ],
  },
  {
    uuid: 'trx-012',
    booking_number: 'TRX-2026-012',
    booking_date: '2026-04-12T08:30:00Z',
    status: {
      label: 'Dibatalkan',
      value: 'dibatalkan',
    },
    check_in: '2026-04-13',
    check_out: '2026-04-15',
    duration: 2,
    total_payment: 600000,
    total_discount: 0,
    payment_type: 'Transfer Bank (BCA)',
    user: {
      uuid: 'member-003',
      name: 'Maya Lestari',
      email: 'maya.lestari@mail.com',
      phone_number: '+628155555555',
    },
    guest_info: {
      name: 'Maya Lestari',
      email: 'maya.lestari@mail.com',
      phone_number: '+628155555555',
    },
    unit: {
      uuid: 'unit-002',
      name: 'Honda Brio RS 2023',
      category: 'Mobil',
      plate_number: 'D 1899 XYZ',
      price_per_day: 300000,
    },
    mitra: {
      uuid: 'mitra-001',
      name: 'Berkah Rental Mobil Bandung',
      company: 'PT Berkah Rental Nusantara',
      city: 'Bandung',
      phone_number: '+628122334455',
      bank_name: 'BCA',
      bank_account_number: '1234567890',
      bank_account_holder: 'PT Berkah Rental Nusantara',
    },
    timeline: [
      {
        status: 'menunggu_konfirmasi',
        label: 'Pesanan Dibuat',
        timestamp: '2026-04-12T08:30:00Z',
        actor: 'Maya Lestari',
      },
      {
        status: 'dibatalkan',
        label: 'Dibatalkan oleh Penyewa',
        timestamp: '2026-04-12T10:00:00Z',
        actor: 'Maya Lestari',
        notes: 'Perubahan jadwal perjalanan pribadi.',
      },
    ],
    version: 2,
    rooms: [
      {
        uuid: 'r-012',
        quantity: 1,
        price: 300000,
        total_price: 600000,
        room_type: { uuid: 'rt-4', name: 'Honda Brio RS 2023' },
        addons: [],
        is_cancellable: false,
        per_night_promos: [],
      },
    ],
  },
  {
    uuid: 'trx-013',
    booking_number: 'TRX-2026-013',
    booking_date: '2026-04-11T15:00:00Z',
    status: {
      label: 'Dibatalkan',
      value: 'dibatalkan',
    },
    check_in: '2026-04-13',
    check_out: '2026-04-15',
    duration: 2,
    total_payment: 1900000,
    total_discount: 0,
    payment_type: 'Transfer Bank (Mandiri)',
    user: {
      uuid: 'member-010',
      name: 'Wahyu Nugroho',
      email: 'wahyu.nugroho@mail.com',
      phone_number: '+6281211223355',
    },
    guest_info: {
      name: 'Wahyu Nugroho',
      email: 'wahyu.nugroho@mail.com',
      phone_number: '+6281211223355',
    },
    unit: {
      uuid: 'unit-004',
      name: 'Mitsubishi Pajero Sport Dakar 4x2',
      category: 'Mobil',
      plate_number: 'B 1234 SSB',
      price_per_day: 950000,
    },
    mitra: {
      uuid: 'mitra-002',
      name: 'Nusantara Trans Jakarta',
      company: 'CV Nusantara Transindo',
      city: 'Jakarta',
      phone_number: '+6281399887766',
      bank_name: 'Mandiri',
      bank_account_number: '1370012345678',
      bank_account_holder: 'CV Nusantara Transindo',
    },
    timeline: [
      {
        status: 'menunggu_konfirmasi',
        label: 'Pesanan Dibuat',
        timestamp: '2026-04-11T15:00:00Z',
        actor: 'Wahyu Nugroho',
      },
      {
        status: 'dibatalkan',
        label: 'Dibatalkan Otomatis oleh Sistem',
        timestamp: '2026-04-11T17:00:00Z',
        actor: 'Sistem Rentaku',
        notes: 'Batas waktu pembayaran 2 jam telah habis.',
      },
    ],
    version: 2,
    rooms: [
      {
        uuid: 'r-013',
        quantity: 1,
        price: 950000,
        total_price: 1900000,
        room_type: { uuid: 'rt-3', name: 'Mitsubishi Pajero Sport' },
        addons: [],
        is_cancellable: false,
        per_night_promos: [],
      },
    ],
  },
  {
    uuid: 'trx-014',
    booking_number: 'TRX-2026-014',
    booking_date: '2026-04-03T11:20:00Z',
    status: {
      label: 'Selesai',
      value: 'selesai',
    },
    check_in: '2026-04-04',
    check_out: '2026-04-08',
    duration: 4,
    total_payment: 440000,
    total_discount: 0,
    payment_type: 'QRIS',
    user: {
      uuid: 'member-011',
      name: 'Dewi Anggraini',
      email: 'dewi.anggraini@mail.com',
      phone_number: '+6281355443322',
    },
    guest_info: {
      name: 'Dewi Anggraini',
      email: 'dewi.anggraini@mail.com',
      phone_number: '+6281355443322',
    },
    unit: {
      uuid: 'unit-007',
      name: 'Yamaha NMAX 155 Connected',
      category: 'Motor',
      plate_number: 'L 4567 GH',
      price_per_day: 110000,
    },
    mitra: {
      uuid: 'mitra-003',
      name: 'Surabaya Motor Rental',
      city: 'Surabaya',
      phone_number: '+6281566778899',
      bank_name: 'BRI',
      bank_account_number: '001201004567509',
      bank_account_holder: 'Hendra Gunawan',
    },
    reimburse_status: 'sudah_dibayar',
    timeline: [
      {
        status: 'menunggu_konfirmasi',
        label: 'Pesanan Dibuat',
        timestamp: '2026-04-03T11:20:00Z',
        actor: 'Dewi Anggraini',
      },
      {
        status: 'terkonfirmasi',
        label: 'Pembayaran Dikonfirmasi',
        timestamp: '2026-04-03T11:35:00Z',
        actor: 'Admin Rentaku',
      },
      {
        status: 'diteruskan_mitra',
        label: 'Diteruskan ke Mitra',
        timestamp: '2026-04-03T12:00:00Z',
        actor: 'Admin Rentaku',
      },
      {
        status: 'berjalan',
        label: 'Mulai Sewa',
        timestamp: '2026-04-04T08:30:00Z',
        actor: 'Mitra Surabaya Motor',
      },
      {
        status: 'selesai',
        label: 'Selesai Sewa',
        timestamp: '2026-04-08T17:00:00Z',
        actor: 'Mitra Surabaya Motor',
      },
    ],
    version: 5,
    rooms: [
      {
        uuid: 'r-014',
        quantity: 1,
        price: 110000,
        total_price: 440000,
        room_type: { uuid: 'rt-5', name: 'Yamaha NMAX 155 Connected' },
        addons: [],
        is_cancellable: false,
        per_night_promos: [],
      },
    ],
  },
];

const getBookingDb = (): BookingType[] => {
  return loadFromStorage<BookingType[]>('rentaku_transaksi', defaultBookings);
};

const saveBookingDb = (data: BookingType[]) => {
  saveToStorage('rentaku_transaksi', data);
};

const createPagination = (page: number, perPage: number, totalData: number) => {
  const totalPage = Math.max(1, Math.ceil(totalData / perPage));
  const currentPage = Math.min(Math.max(page, 1), totalPage);

  return {
    data_per_page: perPage,
    next_page: currentPage < totalPage ? currentPage + 1 : 0,
    prev_page: currentPage > 1 ? currentPage - 1 : 0,
    first_page: 1,
    last_page: totalPage,
    next_page_url: '',
    previous_page_url: '',
    first_page_url: '',
    last_page_url: '',
    total_page: totalPage,
    total_data: totalData,
  };
};

const parsePagingParams = (queryParams: URLSearchParams) => {
  return {
    page: Number(queryParams.get('page') || '1'),
    perPage: Number(queryParams.get('per_page') || '10'),
  };
};

const paginate = <T>(items: T[], page: number, perPage: number) => {
  const start = (Math.max(page, 1) - 1) * Math.max(perPage, 1);
  const end = start + Math.max(perPage, 1);

  return {
    data: items.slice(start, end),
    pagination: createPagination(page, perPage, items.length),
  };
};

const filterBookings = (items: BookingType[], queryParams: URLSearchParams) => {
  const status = (queryParams.get('status') || '').toLowerCase();
  const search = (queryParams.get('search_param') || '').toLowerCase();
  const startDate = queryParams.get('start_date') || queryParams.get('check_in') || '';
  const endDate = queryParams.get('end_date') || queryParams.get('check_out') || '';
  const mitraUuid = queryParams.get('mitra_uuid') || queryParams.get('agent_uuid') || '';
  const city = (queryParams.get('city') || '').toLowerCase();

  return items.filter((b) => {
    if (status && b.status.value.toLowerCase() !== status) {
      return false;
    }

    if (mitraUuid && b.mitra?.uuid !== mitraUuid) {
      return false;
    }

    if (city && !b.mitra?.city?.toLowerCase().includes(city)) {
      return false;
    }

    if (startDate && b.check_in < startDate) {
      return false;
    }

    if (endDate && b.check_out > endDate) {
      return false;
    }

    if (search) {
      const matchNumber = b.booking_number.toLowerCase().includes(search);
      const matchUser =
        b.user?.name?.toLowerCase().includes(search) ||
        b.guest_info?.name?.toLowerCase().includes(search);
      const matchEmail =
        b.user?.email?.toLowerCase().includes(search) ||
        b.guest_info?.email?.toLowerCase().includes(search);
      const matchUnit =
        b.unit?.name?.toLowerCase().includes(search) ||
        b.rooms?.[0]?.room_type?.name?.toLowerCase().includes(search);
      const matchMitra = b.mitra?.name?.toLowerCase().includes(search);

      if (!matchNumber && !matchUser && !matchEmail && !matchUnit && !matchMitra) {
        return false;
      }
    }

    return true;
  });
};

const updateStatus = (
  items: BookingType[],
  uuid: string,
  newStatus: TransaksiStatus,
  statusLabel: string,
  actor: string,
  notes?: string,
) => {
  const index = items.findIndex((b) => b.uuid === uuid);

  if (index === -1) return null;

  const booking = items[index];
  const now = new Date().toISOString();

  booking.status = {
    label: statusLabel,
    value: newStatus,
  };
  booking.version += 1;

  if (newStatus === 'selesai' && !booking.reimburse_status) {
    booking.reimburse_status = 'belum_dibayar';
  }

  booking.timeline = [
    ...(booking.timeline || []),
    {
      status: newStatus,
      label: statusLabel,
      timestamp: now,
      actor,
      notes,
    },
  ];

  items[index] = booking;
  saveBookingDb(items);
  return booking;
};

export const handleBookingMock = ({
  path,
  queryParams,
  method,
  data,
}: MockRequestContext): MockResult => {
  const bookings = getBookingDb();

  if ((path === '/booking' || path === '/transaksi') && method === 'GET') {
    const { page, perPage } = parsePagingParams(queryParams);
    const filtered = filterBookings(bookings, queryParams);
    const result = paginate(filtered, page, perPage);

    return {
      data: result.data,
      success: true,
      message: 'Success',
      pagination: result.pagination,
    };
  }

  // 1. Confirm Payment: menunggu_konfirmasi -> terkonfirmasi
  const confirmMatch =
    path.match(/^\/(?:booking|transaksi)\/([^/]+)\/confirm$/u) ||
    path.match(/^\/booking\/confirm\/([^/]+)$/u);

  if (confirmMatch && (method === 'PUT' || method === 'POST')) {
    const uuid = confirmMatch[1];
    const updated = updateStatus(
      bookings,
      uuid,
      'terkonfirmasi',
      'Pembayaran Dikonfirmasi',
      'Admin Rentaku',
      'Pembayaran telah diverifikasi dan dikonfirmasi oleh admin.',
    );

    return createSuccessResponse(updated, 'Pembayaran transaksi berhasil dikonfirmasi');
  }

  // 2. Forward to Mitra: terkonfirmasi -> diteruskan_mitra
  const forwardMatch =
    path.match(/^\/(?:booking|transaksi)\/([^/]+)\/forward$/u) ||
    path.match(/^\/booking\/forward\/([^/]+)$/u);

  if (forwardMatch && (method === 'PUT' || method === 'POST')) {
    const uuid = forwardMatch[1];
    const updated = updateStatus(
      bookings,
      uuid,
      'diteruskan_mitra',
      'Diteruskan ke Mitra',
      'Admin Rentaku',
      'Pesanan telah diteruskan ke mitra pemilik unit.',
    );

    return createSuccessResponse(updated, 'Transaksi berhasil diteruskan ke mitra');
  }

  // 3. Start Rental: diteruskan_mitra -> berjalan
  const startMatch =
    path.match(/^\/(?:booking|transaksi)\/([^/]+)\/start$/u) ||
    path.match(/^\/booking\/check-in\/([^/]+)$/u);

  if (startMatch && (method === 'PUT' || method === 'POST')) {
    const uuid = startMatch[1];
    const updated = updateStatus(
      bookings,
      uuid,
      'berjalan',
      'Mulai Sewa (Unit Diserahkan)',
      'Admin / Mitra Rentaku',
      'Unit kendaraan/barang telah diserahkan ke penyewa.',
    );

    return createSuccessResponse(updated, 'Sewa berhasil dimulai');
  }

  // 4. Finish Rental: berjalan -> selesai
  const finishMatch =
    path.match(/^\/(?:booking|transaksi)\/([^/]+)\/finish$/u) ||
    path.match(/^\/booking\/check-out\/([^/]+)$/u);

  if (finishMatch && (method === 'PUT' || method === 'POST')) {
    const uuid = finishMatch[1];
    const updated = updateStatus(
      bookings,
      uuid,
      'selesai',
      'Selesai Sewa (Unit Dikembalikan)',
      'Admin / Mitra Rentaku',
      'Unit telah dikembalikan dan diverifikasi kondisinya.',
    );

    return createSuccessResponse(updated, 'Sewa berhasil diselesaikan');
  }

  // 5. Cancel Transaction: -> dibatalkan
  const cancelMatch =
    path.match(/^\/(?:booking|transaksi)\/([^/]+)\/cancel$/u) ||
    path.match(/^\/booking\/cancel\/([^/]+)$/u);

  if (cancelMatch && (method === 'PUT' || method === 'POST')) {
    const uuid = cancelMatch[1];
    const reason = data?.reason || data?.notes || 'Dibatalkan oleh admin';
    const updated = updateStatus(
      bookings,
      uuid,
      'dibatalkan',
      'Transaksi Dibatalkan',
      'Admin Rentaku',
      reason,
    );

    return createSuccessResponse(updated, 'Transaksi berhasil dibatalkan');
  }

  // 6. Create Reimburse
  const reimburseMatch = path.match(/^\/(?:booking|transaksi)\/([^/]+)\/reimburse$/u);

  if (reimburseMatch && method === 'POST') {
    const uuid = reimburseMatch[1];
    const index = bookings.findIndex((b) => b.uuid === uuid);

    if (index !== -1) {
      bookings[index].reimburse_status = 'belum_dibayar';
      saveBookingDb(bookings);
    }
    return createSuccessResponse({ transaction_uuid: uuid }, 'Pengajuan reimburse berhasil dibuat');
  }

  // 7. Get Detail
  const detailMatch = path.match(/^\/(?:booking|transaksi)\/([^/]+)$/u);

  if (detailMatch && method === 'GET') {
    const uuid = detailMatch[1];
    const booking = bookings.find((b) => b.uuid === uuid);

    return createSuccessResponse(booking || null);
  }

  return undefined;
};
