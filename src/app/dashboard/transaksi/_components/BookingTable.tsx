'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';

import { Chip, Divider, IconButton, ListItemIcon, MenuItem } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import dayjs from 'dayjs';
import {
  Ban,
  CheckCircle2,
  DollarSign,
  EllipsisVertical,
  Eye,
  KeyRound,
  PlayCircle,
  Send,
} from 'lucide-react';

import DataGrid from '@/components/mui/DataGrid';
import Menu from '@/components/mui/Menu';
import useTablePagination from '@/lib/hooks/useTablePagination';
import { usePermission } from '@/services/permission/usePermission';
import useCancelTransaksi from '@/services/transaksi/useCancelTransaksi';
import useConfirmTransaksi from '@/services/transaksi/useConfirmTransaksi';
import useCreateReimburse from '@/services/transaksi/useCreateReimburse';
import useFinishTransaksi from '@/services/transaksi/useFinishTransaksi';
import useForwardTransaksi from '@/services/transaksi/useForwardTransaksi';
import useGetBookings from '@/services/transaksi/useGetBookings';
import useStartTransaksi from '@/services/transaksi/useStartTransaksi';

import { getBookingStatusColor, getBookingStatusLabel } from '../_utils';
import BookingTableToolbar, { BookingTableToolbarProps } from './BookingTableToolbar';

interface Props {
  date?: string;
}

const BookingTable = ({ date }: Props) => {
  const checkPermission = usePermission();
  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [status, setStatus] = useState('');

  const {
    data: rawData,
    isLoading,
    refetch,
  } = useGetBookings({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
      ...(date ? { check_in: date } : {}),
      status,
    },
    enabled: true,
  });

  const { mutate: confirmTransaksi } = useConfirmTransaksi({ onSuccess: () => refetch() });
  const { mutate: forwardTransaksi } = useForwardTransaksi({ onSuccess: () => refetch() });
  const { mutate: startTransaksi } = useStartTransaksi({ onSuccess: () => refetch() });
  const { mutate: finishTransaksi } = useFinishTransaksi({ onSuccess: () => refetch() });
  const { mutate: cancelTransaksi } = useCancelTransaksi({ onSuccess: () => refetch() });
  const { mutate: createReimburse } = useCreateReimburse({ onSuccess: () => refetch() });

  const data = useMemo(() => {
    return rawData
      ? rawData.data.map((item) => ({
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
          <div className="flex flex-col justify-center py-1">
            <span className="text-primary-600 font-semibold">{row.booking_number || row.uuid}</span>
            <span className="text-[11px] text-slate-400">
              {row.booking_date ? dayjs(row.booking_date).format('DD/MM/YYYY HH:mm') : '-'}
            </span>
          </div>
        );
      },
    },
    {
      field: 'user',
      headerName: 'Penyewa (User)',
      flex: 1.4,
      renderCell({ row }) {
        const name = row.user?.name || row.guest_info?.name || '-';
        const contact =
          row.user?.phone_number || row.guest_info?.phone_number || row.user?.email || '';

        return (
          <div className="flex flex-col justify-center py-1 text-xs">
            <span className="font-medium text-slate-800">{name}</span>
            <span className="text-slate-500">{contact}</span>
          </div>
        );
      },
    },
    {
      field: 'unit',
      headerName: 'Unit Sewa',
      flex: 1.5,
      renderCell({ row }) {
        const unitName = row.unit?.name || 'Unit Rental';
        const plate = row.unit?.plate_number || row.unit?.category || '-';

        return (
          <div className="flex flex-col justify-center py-1 text-xs">
            <span className="font-medium text-slate-800">{unitName}</span>
            <span className="font-mono text-slate-500">{plate}</span>
          </div>
        );
      },
    },
    {
      field: 'mitra',
      headerName: 'Mitra Pemilik',
      flex: 1.4,
      renderCell({ row }) {
        const mitraName = row.mitra?.name || 'Mitra Rentaku';
        const city = row.mitra?.city || '-';

        return (
          <div className="flex flex-col justify-center py-1 text-xs">
            <span className="font-medium text-slate-800">{mitraName}</span>
            <span className="text-slate-500">{city}</span>
          </div>
        );
      },
    },
    {
      field: 'rental_period',
      headerName: 'Periode Sewa',
      flex: 1.5,
      renderCell({ row }) {
        const start = row.check_in ? dayjs(row.check_in).format('DD MMM') : '-';
        const end = row.check_out ? dayjs(row.check_out).format('DD MMM YYYY') : '-';
        const duration = row.duration ? `(${row.duration} hari)` : '';

        return (
          <div className="flex flex-col justify-center py-1 text-xs">
            <span className="font-medium text-slate-800">{`${start} - ${end}`}</span>
            <span className="text-slate-500">{duration}</span>
          </div>
        );
      },
    },
    {
      field: 'total_payment',
      headerName: 'Total Biaya',
      flex: 1.2,
      renderCell({ row }) {
        return (
          <span className="font-semibold text-slate-900">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 0,
            }).format(row.total_payment || 0)}
          </span>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 170,
      renderCell({ row }) {
        const statusValue = row.status?.value || 'menunggu_konfirmasi';
        const color = getBookingStatusColor(statusValue);
        const label = getBookingStatusLabel(statusValue);

        return (
          <Chip
            size="small"
            label={label}
            color={color}
            variant="filled"
            className="text-xs font-medium"
          />
        );
      },
    },
    {
      field: 'uuid',
      headerName: '',
      width: 50,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      type: 'actions',
      renderCell(params) {
        const row = params.row;
        const statusValue = row.status?.value || '';
        const canUpdate = checkPermission('transaksi', 'Update');

        return (
          <Menu
            Button={IconButton}
            buttonProps={{
              children: <EllipsisVertical size={'1rem'} />,
            }}
          >
            <MenuItem
              component={Link}
              href={`/dashboard/transaksi/${params.value}`}
              disabled={!checkPermission('transaksi', 'Read')}
            >
              <ListItemIcon>
                <Eye size={'1rem'} />
              </ListItemIcon>
              Detail Transaksi
            </MenuItem>

            {statusValue === 'menunggu_konfirmasi' && canUpdate && (
              <MenuItem onClick={() => confirmTransaksi({ uuid: params.value })}>
                <ListItemIcon>
                  <CheckCircle2 size={'1rem'} className="text-emerald-500" />
                </ListItemIcon>
                Konfirmasi Pembayaran
              </MenuItem>
            )}

            {statusValue === 'terkonfirmasi' && canUpdate && (
              <MenuItem onClick={() => forwardTransaksi({ uuid: params.value })}>
                <ListItemIcon>
                  <Send size={'1rem'} className="text-blue-500" />
                </ListItemIcon>
                Teruskan ke Mitra
              </MenuItem>
            )}

            {statusValue === 'diteruskan_mitra' && canUpdate && (
              <MenuItem onClick={() => startTransaksi({ uuid: params.value })}>
                <ListItemIcon>
                  <KeyRound size={'1rem'} className="text-indigo-500" />
                </ListItemIcon>
                Mulai Sewa (Serah Unit)
              </MenuItem>
            )}

            {statusValue === 'berjalan' && canUpdate && (
              <MenuItem onClick={() => finishTransaksi({ uuid: params.value })}>
                <ListItemIcon>
                  <PlayCircle size={'1rem'} className="text-emerald-500" />
                </ListItemIcon>
                Selesai Sewa (Unit Kembali)
              </MenuItem>
            )}

            {statusValue === 'selesai' && canUpdate && (
              <MenuItem onClick={() => createReimburse({ uuid: params.value })}>
                <ListItemIcon>
                  <DollarSign size={'1rem'} className="text-amber-500" />
                </ListItemIcon>
                Buat Reimburse Mitra
              </MenuItem>
            )}

            {['menunggu_konfirmasi', 'terkonfirmasi', 'diteruskan_mitra'].includes(statusValue) &&
              canUpdate && (
                <>
                  <Divider className="-mx-4 my-1" />
                  <MenuItem
                    className="text-red-500"
                    onClick={() => cancelTransaksi({ uuid: params.value })}
                  >
                    <ListItemIcon>
                      <Ban size={'1rem'} className="text-red-500" />
                    </ListItemIcon>
                    Batalkan Transaksi
                  </MenuItem>
                </>
              )}
          </Menu>
        );
      },
    },
  ];

  return (
    <div className="flex h-1 flex-grow flex-col pb-16">
      <DataGrid
        rows={data}
        columns={columns}
        loading={isLoading}
        checkboxSelection={false}
        slotProps={{
          toolbar: {
            onSearch: (val) => setSearch(val),
            status,
            onStatusChange: setStatus,
          } as BookingTableToolbarProps,
        }}
        slots={{
          toolbar: BookingTableToolbar as any,
        }}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        paginationResponse={rawData?.pagination}
        paginationMode="server"
        showToolbar
      />
    </div>
  );
};

export default BookingTable;
