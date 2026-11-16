'use client';

import { useMemo } from 'react';

import { Chip, Divider, IconButton, ListItemIcon, MenuItem } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import DataGrid from '@/components/mui/DataGrid';
import { PaginationModelType } from '@/lib/hooks/useTablePagination';
import formatToRp from '@/lib/utils/formatToRp';
import useGetBookingReports from '@/services/reports/useGetBookingReport';

import { getBookingStatusColor } from '../../booking/_utils';
import BookingReportTableToolbar, {
  BookingReportTableToolbarProps,
} from './BookingReportTableToolbar';

export interface Props {
  paginationModel: PaginationModelType;
  setPaginationModel: (paginationModel: PaginationModelType) => void;
  search: string;
  setSearch: (search: string) => void;
  dateRange: string;
  setDateRange: (dateRange: string) => void;
  status: string;
  setStatus: (status: string) => void;
}

const BookingReportTable = ({
  paginationModel,
  setPaginationModel,
  search,
  setSearch,
  dateRange,
  setDateRange,
  status,
  setStatus,
}: Props) => {
  const { data: rawData, isLoading } = useGetBookingReports({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
      updated_at_date_range: dateRange,
      status,
    },
  });

  const data = useMemo(() => {
    return rawData?.data
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
      hideable: false,
      flex: 2,
    },
    {
      field: 'guest_name',
      headerName: 'Guest Name',
      flex: 2,
    },
    {
      field: 'booking_time',
      headerName: 'Booking Date',
      hideable: false,
      flex: 2,
    },
    {
      field: 'check_in',
      headerName: 'Check-in Date',
      flex: 1,
    },
    {
      field: 'check_out',
      headerName: 'Check-out Date',
      flex: 1,
    },
    {
      field: 'duration',
      headerName: 'Duration',
      flex: 1,
      valueGetter: (_, row) => `${row.duration} nights`,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell(params) {
        return (
          <Chip
            size="small"
            label={params.row.status}
            color={getBookingStatusColor(params.row.status.toLocaleLowerCase())}
          />
        );
      },
    },

    {
      field: 'total_rooms_price',
      headerName: 'Total Rooms Price',
      flex: 2,
      type: 'number',
      valueGetter: (_, row) => formatToRp(row.total_rooms_price),
    },
    {
      field: 'total_add_ons_price',
      headerName: 'Total Add-ons Price',
      flex: 2,
      type: 'number',
      valueGetter: (_, row) => formatToRp(row.total_add_ons_price),
    },
    {
      field: 'grand_total',
      headerName: 'Grand Total',
      flex: 2,
      type: 'number',
      valueGetter: (_, row) =>
        formatToRp(Number(row.grand_total.replaceAll(',', '').replace('.00', ''))),
    },
  ];

  return (
    <>
      <div className="flex h-1 flex-grow flex-col pb-16">
        <DataGrid
          rows={data}
          columns={columns}
          loading={isLoading}
          checkboxSelection={false}
          slotProps={{
            toolbar: {
              onSearch: (val) => setSearch(val),
              dateRange,
              onDateRangeChange: (val) => setDateRange(val),
              status,
              onStatusChange: (val) => setStatus(val),
            } as BookingReportTableToolbarProps,
          }}
          slots={{
            toolbar: BookingReportTableToolbar as any,
          }}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationResponse={rawData?.pagination}
          paginationMode="server"
          showToolbar
        />
      </div>
    </>
  );
};

export default BookingReportTable;
