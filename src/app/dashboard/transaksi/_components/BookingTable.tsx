'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';

import { Chip, IconButton, ListItemIcon, MenuItem } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import dayjs from 'dayjs';
import { EllipsisVertical, Eye, FileText } from 'lucide-react';

import DataGrid from '@/components/mui/DataGrid';
import Menu from '@/components/mui/Menu';
import useTablePagination from '@/lib/hooks/useTablePagination';
import useGetBookings from '@/services/transaksi/useGetBookings';

import { getBookingStatusColor } from '../_utils';
import BookingTableToolbar, { BookingTableToolbarProps } from './BookingTableToolbar';

interface Props {
  date?: string;
}

const BookingTable = ({ date }: Props) => {
  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [status, setStatus] = useState('');

  const { data: rawData, isLoading } = useGetBookings({
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
      headerName: 'Booking Number',
      flex: 1.5,
    },
    {
      field: 'guest_information',
      headerName: 'Guest',
      flex: 2,
      valueGetter: (_, row) => row?.guest_info?.name || '-',
    },
    // {
    //   field: 'booking_date',
    //   headerName: 'Booking Date',
    //   flex: 1.5,
    //   valueGetter: (_, row) => dayjs(row.booking_date).format('DD MMM YYYY'),
    // },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell(params) {
        return (
          <Chip
            size="small"
            label={params.row?.status?.label || '-'}
            color={getBookingStatusColor(params.row?.status?.value || '')}
          />
        );
      },
    },
    {
      field: 'check_in',
      headerName: 'Checked In at',
      flex: 2,
      valueGetter: (_, row) =>
        row?.checked_in_at ? dayjs(row.checked_in_at).format('DD MMM YYYY, HH:mm') : '-',
    },
    {
      field: 'check_out',
      headerName: 'Checked Out at',
      flex: 2,
      valueGetter: (_, row) =>
        row?.checked_out_at ? dayjs(row.checked_out_at).format('DD MMM YYYY, HH:mm') : '-',
    },
    {
      field: 'guest_count',
      headerName: 'Guests Total',
      flex: 2,
      valueGetter(_, row) {
        const adults = row?.guest_count?.adults ?? 0;
        const children = row?.guest_count?.children ?? 0;

        return `${adults} adults${children ? `, ${children} children` : ''}`;
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
        return (
          <Menu
            Button={IconButton}
            buttonProps={{
              children: <EllipsisVertical size={'1rem'} />,
            }}
          >
            <MenuItem component={Link} href={`/dashboard/transaksi/${params.row.uuid}`}>
              <ListItemIcon>
                <Eye size={'1rem'} />
              </ListItemIcon>
              Detail
            </MenuItem>
          </Menu>
        );
      },
    },
  ];

  return (
    <div className="mb-2 flex h-[75vh] flex-col">
      <DataGrid
        rows={data}
        columns={columns}
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
        loading={isLoading}
      />
    </div>
  );
};

export default BookingTable;
