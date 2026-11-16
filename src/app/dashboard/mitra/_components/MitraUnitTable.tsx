'use client';

import React from 'react';

import { Chip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import DataGrid from '@/components/mui/DataGrid';
import { MitraUnitType } from '@/lib/types/mitra.type';

interface Props {
  units?: MitraUnitType[];
  isLoading?: boolean;
}

const statusMap: Record<
  string,
  { label: string; color: 'success' | 'info' | 'warning' | 'default' }
> = {
  tersedia: { label: 'Tersedia', color: 'success' },
  disewa: { label: 'Sedang Disewa', color: 'info' },
  perawatan: { label: 'Dalam Perawatan', color: 'warning' },
};

const MitraUnitTable = ({ units = [], isLoading = false }: Props) => {
  const rows = units.map((u, index) => ({
    ...u,
    id: u.uuid || `unit-${index}`,
  }));

  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: 'name',
      headerName: 'Nama Unit',
      flex: 1.8,
      renderCell({ row }) {
        return <span className="font-semibold text-slate-800">{row.name}</span>;
      },
    },
    {
      field: 'category',
      headerName: 'Kategori',
      flex: 1,
      valueGetter: (_, row) => row.category || 'Kendaraan',
    },
    {
      field: 'plate_number',
      headerName: 'Nomor Polisi / Identitas',
      flex: 1.2,
      renderCell({ row }) {
        return (
          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
            {row.plate_number || '-'}
          </span>
        );
      },
    },
    {
      field: 'price_per_day',
      headerName: 'Tarif Sewa / Hari',
      flex: 1.2,
      valueGetter(_, row) {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0,
        }).format(row.price_per_day || 0);
      },
    },
    {
      field: 'status',
      headerName: 'Status Ketersediaan',
      width: 160,
      renderCell({ row }) {
        const val = row.status || 'tersedia';
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
  ];

  return (
    <div className="flex h-64 flex-col">
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        checkboxSelection={false}
        paginationMode="client"
      />
    </div>
  );
};

export default MitraUnitTable;
