'use client';

import { useMemo } from 'react';

import { Chip, Divider, IconButton, ListItemIcon, MenuItem } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import dayjs from 'dayjs';

import DataGrid from '@/components/mui/DataGrid';
import { PaginationModelType } from '@/lib/hooks/useTablePagination';
import formatToRp from '@/lib/utils/formatToRp';
import useGetPaymentReports from '@/services/reports/useGetPaymentReport';

import BookingReportTableToolbar, {
  PaymentReportTableToolbarProps,
} from './PaymentReportTableToolbar';

export interface Props {
  paginationModel: PaginationModelType;
  setPaginationModel: (paginationModel: PaginationModelType) => void;
  search: string;
  setSearch: (search: string) => void;
  dateRange: string;
  setDateRange: (dateRange: string) => void;
}

const PaymentReportTable = ({
  paginationModel,
  setPaginationModel,
  search,
  setSearch,
  dateRange,
  setDateRange,
}: Props) => {
  const { data: rawData, isLoading } = useGetPaymentReports({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
      updated_at_date_range: dateRange,
    },
  });

  const data = useMemo(() => {
    return rawData?.data
      ? rawData.data.map((item) => ({
          ...item,
          id: item.payment_number,
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
      field: 'payment_number',
      headerName: 'Payment Number',
      hideable: false,
      flex: 2,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 2,
    },
    {
      field: 'check_in',
      headerName: 'Check-in Date',
      hideable: false,
      flex: 1.5,
      valueGetter: (_, row) => dayjs(row.check_in).format('DD MMM YYYY, HH:mm'),
    },
    {
      field: 'number_rooms',
      headerName: 'Number of Rooms',
      flex: 1,
      type: 'number',
    },
    {
      field: 'invoice_amount',
      headerName: 'Invoice Amount',
      flex: 2,
      type: 'number',
      valueGetter: (_, row) => formatToRp(row.invoice_amount),
    },
    {
      field: 'total',
      headerName: 'Total',
      flex: 2,
      type: 'number',
      valueGetter: (_, row) => formatToRp(row.total),
    },
    {
      field: 'total_fee',
      headerName: 'Admin Fee',
      flex: 2,
      type: 'number',
      valueGetter: (_, row) => formatToRp(row.total_fee),
    },
    {
      field: 'total_after_fee',
      headerName: 'Total After Fee',
      flex: 2,
      type: 'number',
      valueGetter: (_, row) => formatToRp(row.total - row.total_fee),
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
            } as PaymentReportTableToolbarProps,
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

export default PaymentReportTable;
