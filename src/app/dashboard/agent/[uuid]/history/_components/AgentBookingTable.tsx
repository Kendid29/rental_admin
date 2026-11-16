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
import formatToRp from '@/lib/utils/formatToRp';
import BookingTableToolbar, { BookingTableToolbarProps } from '@/app/dashboard/booking/_components/BookingTableToolbar';
import { getBookingStatusColor } from '@/app/dashboard/booking/_utils';
import useDownlodBookingInvoice from '@/services/booking/useDownlodBookingInvoice';
import useDownlodBookingVoucher from '@/services/booking/useDownlodBookingVoucher';
import useGetAgentBookings from '@/services/booking/useGetAgentBookings';

interface Props {
  agentUuid: string;
}

const AgentBookingTable = ({ agentUuid }: Props) => {
  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [status, setStatus] = useState('');

  const { data: rawData, isLoading } = useGetAgentBookings(agentUuid, {
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
      status,
    },
  });

  const data = useMemo(() => {
    return rawData
      ? rawData.data.map((item) => ({
          ...item,
          id: item.uuid,
        }))
      : [];
  }, [rawData]);

  const { mutate: downloadBookingInvoice, isPending: isDownloadingInvoice } =
    useDownlodBookingInvoice();

  const { mutate: downloadBookingVoucher, isPending: isDownloadingVoucher } =
    useDownlodBookingVoucher();

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
      headerName: 'Check In',
      flex: 1.5,
      valueGetter: (_, row) => row?.check_in ? dayjs(row.check_in).format('DD MMM YYYY') : '-',
    },
    {
      field: 'check_out',
      headerName: 'Check Out',
      flex: 1.5,
      valueGetter: (_, row) => row?.check_out ? dayjs(row.check_out).format('DD MMM YYYY') : '-',
    },
    {
      field: 'guest_count',
      headerName: 'Guests Total',
      flex: 2,
      valueGetter: (_, row) => {
        const adults = row?.guest_count?.adults ?? 0;
        const children = row?.guest_count?.children ?? 0;
        return `${adults} adults${children ? `, ${children} children` : ''}`;
      },
    },
    {
      field: 'total_payment',
      headerName: 'Total Price',
      flex: 1.5,
      valueGetter: (_, row) => formatToRp(row.invoice?.grand_total ?? row.total_payment ?? 0),
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
            <MenuItem
              onClick={() => {
                downloadBookingInvoice({
                  booking_uuid: params.row.uuid,
                  title: `${params.row.booking_number}-${params.row.guest_info?.name || 'guest'}-${dayjs(params.row.check_in).format('DD-MMM-YYYY')}`,
                });
              }}
              disabled={isDownloadingInvoice}
            >
              <ListItemIcon>
                <FileText size="1rem" />
              </ListItemIcon>
              Download Invoice
            </MenuItem>
            <MenuItem
              onClick={() => {
                downloadBookingVoucher({
                  booking_uuid: params.row.uuid,
                  title: `${params.row.booking_number}-${params.row.guest_info?.name || 'guest'}-${dayjs(params.row.check_in).format('DD-MMM-YYYY')}`,
                });
              }}
              disabled={isDownloadingVoucher}
            >
              <ListItemIcon>
                <FileText size="1rem" />
              </ListItemIcon>
              Download Voucher
            </MenuItem>
            <MenuItem component={Link} href={`/dashboard/booking/${params.row.uuid}`}>
              <ListItemIcon>
                <Eye size="1rem" />
              </ListItemIcon>
              View Details
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

export default AgentBookingTable;
