'use client';

import React, { useMemo } from 'react';

import Link from 'next/link';

import { Button, Chip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import dayjs from 'dayjs';
import { ExternalLink } from 'lucide-react';

import DataGrid from '@/components/mui/DataGrid';
import useGetBookings from '@/services/transaksi/useGetBookings';

interface Props {
  userEmail?: string;
  userName?: string;
}

const statusMap: Record<
  string,
  { label: string; color: 'warning' | 'info' | 'primary' | 'success' | 'error' | 'default' }
> = {
  menunggu_konfirmasi: { label: 'Menunggu Konfirmasi', color: 'warning' },
  terkonfirmasi: { label: 'Terkonfirmasi', color: 'info' },
  diteruskan_mitra: { label: 'Diteruskan ke Mitra', color: 'primary' },
  berjalan: { label: 'Sedang Berjalan', color: 'info' },
  selesai: { label: 'Selesai', color: 'success' },
  dibatalkan: { label: 'Dibatalkan', color: 'error' },
  // legacy fallbacks
  pending: { label: 'Menunggu', color: 'warning' },
  confirmed: { label: 'Terkonfirmasi', color: 'info' },
  completed: { label: 'Selesai', color: 'success' },
  cancelled: { label: 'Dibatalkan', color: 'error' },
};

const UserTransactionHistory = ({ userEmail, userName }: Props) => {
  const { data: rawData, isLoading } = useGetBookings({
    params: {
      search_param: userEmail || userName || '',
      with_pagination: 'true',
    },
  });

  const data = useMemo(() => {
    return rawData?.data
      ? rawData.data.map((item: any) => ({
          ...item,
          id: item.uuid,
        }))
      : [];
  }, [rawData]);

  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: 'booking_number',
      headerName: 'Kode Transaksi',
      flex: 1.2,
      renderCell({ row }) {
        return (
          <span className="text-primary-600 font-semibold">{row.booking_number || row.uuid}</span>
        );
      },
    },
    {
      field: 'unit_name',
      headerName: 'Unit Sewa',
      flex: 1.5,
      valueGetter(_, row) {
        return row.unit?.name || row.unit_name || 'Unit Kendaraan';
      },
    },
    {
      field: 'rental_period',
      headerName: 'Periode Sewa',
      flex: 1.5,
      valueGetter(_, row) {
        const start = row.check_in ? dayjs(row.check_in).format('DD MMM YYYY') : '-';
        const end = row.check_out ? dayjs(row.check_out).format('DD MMM YYYY') : '-';

        return `${start} - ${end}`;
      },
    },
    {
      field: 'total_payment',
      headerName: 'Total Biaya',
      flex: 1,
      valueGetter(_, row) {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0,
        }).format(row.total_payment || 0);
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 170,
      renderCell({ row }) {
        const val = row.status?.value || row.status || 'menunggu_konfirmasi';
        const config = statusMap[val] || { label: val, color: 'default' };

        return (
          <Chip
            size="small"
            label={config.label}
            color={config.color}
            variant="filled"
            className="text-xs font-medium"
          />
        );
      },
    },
    {
      field: 'action',
      headerName: '',
      width: 80,
      sortable: false,
      renderCell({ row }) {
        return (
          <Button
            component={Link}
            href={`/dashboard/transaksi/${row.uuid}`}
            size="small"
            variant="text"
            color="primary"
            startIcon={<ExternalLink size="0.9rem" />}
          >
            Detail
          </Button>
        );
      },
    },
  ];

  return (
    <div className="flex h-72 flex-col">
      <DataGrid
        rows={data}
        columns={columns}
        loading={isLoading}
        checkboxSelection={false}
        paginationMode="client"
      />
    </div>
  );
};

export default UserTransactionHistory;
