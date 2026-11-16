'use client';

import React, { useMemo } from 'react';

import {
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import dayjs from 'dayjs';
import { X } from 'lucide-react';

import DataGrid from '@/components/mui/DataGrid';
import useTablePagination from '@/lib/hooks/useTablePagination';
import formatToRp from '@/lib/utils/formatToRp';
import useGetRoomsAndPricings from '@/services/rooms-and-pricing/useGetRoomsAndPricings';

import { parseDateRangeToDatesBySelectedDate } from '../_utils';
import { RoomsAndPricingBulkEditFormType } from '../_utils/rooms-and-pricing-bulk-edit-schema';

interface Props extends Omit<DialogProps, 'data'> {
  data: RoomsAndPricingBulkEditFormType;
}

const RoomsAndPricingBulkEditTable = ({ data, open, onClose, ...props }: Props) => {
  const { paginationModel, setPaginationModel } = useTablePagination();

  const { data: rawData, isLoading } = useGetRoomsAndPricings({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      dates: parseDateRangeToDatesBySelectedDate(data.date_range, data.selected_days).join(','),
      room_type_uuids: data.room_type_uuids.join(','),
    },
    enabled: !!data.date_range && !!data.room_type_uuids && !!open,
  });

  const tableData = useMemo(() => {
    return rawData
      ? rawData.data.map((item) => ({
          ...item,
          id: item.uuid,
        }))
      : [];
  }, [rawData]);

  const columns: GridColDef<(typeof tableData)[number]>[] = [
    {
      field: 'date',
      headerName: 'Date',
      flex: 3,
      valueGetter: (_, row) => dayjs(row.date).format('DD MMMM YYYY'),
    },
    {
      field: 'room_type.name',
      headerName: 'Room Type',
      flex: 3,
      valueGetter: (_, row) => row.room_type.name,
    },
    // {
    //   field: 'bed_type',
    //   headerName: 'Bed Type',
    //   flex: 1,
    //   valueGetter: (_, row) =>
    //     BED_TYPE.find((item) => item.value === row.feature_highlight.bed_type)?.label || '-',
    // },
    {
      field: 'quantity',
      headerName: 'Room Quantity',
      flex: 2,
      valueGetter: (_, row) => row.quantity || '-',
      renderCell(params) {
        return (
          <div className="flex h-full">
            <Typography className="my-auto">
              <span className="text-stone-400">Before : {params.row.quantity || 0} </span>
              <br /> <span className="mr-2.5">After</span> : {data.quantity}
            </Typography>
          </div>
        );
      },
    },
    {
      field: 'base_price',
      headerName: 'Base Price',
      flex: 2,
      valueGetter: (_, row) => formatToRp(row.base_price),
      renderCell(params) {
        return (
          <div className="flex h-full">
            <Typography className="my-auto">
              <span className="text-stone-400">
                Before : {formatToRp(params.row.base_price || 0)}{' '}
              </span>
              <br /> <span className="mr-2.5">After</span> : {formatToRp(data.base_price)}
            </Typography>
          </div>
        );
      },
    },
    {
      field: 'selling_price',
      headerName: 'Selling Price',
      flex: 2,
      valueGetter: (_, row) => formatToRp(row.selling_price),
      renderCell(params) {
        return (
          <div className="flex h-full">
            <Typography className="my-auto">
              <span className="text-stone-400">
                Before : {formatToRp(params.row.selling_price || 0)}{' '}
              </span>
              <br /> <span className="mr-2.5">After</span> : {formatToRp(data.selling_price)}
            </Typography>
          </div>
        );
      },
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl" {...props}>
      <DialogTitle className="flex justify-between">
        <span>Room and Pricing List</span>
        <IconButton onClick={() => onClose?.({}, 'backdropClick')}>
          <X size={'1rem'} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <div className="mb-2 flex h-[75vh] flex-col">
          <DataGrid
            classes={{
              main: 'pt-4',
            }}
            rows={tableData}
            columns={columns}
            checkboxSelection={false}
            // slotProps={{
            //   toolbar: {
            //     onSearch: (val) => setSearch(val),
            //     roomType,
            //     onRoomTypeChange: setRoomType,
            //     bedType,
            //     onBedTypeChange: setBedType,
            //   } as RoomsAndPricingTableToolbarProps,
            // }}
            // slots={{
            //   toolbar: RoomsAndPricingTableToolbar as any,
            // }}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            paginationResponse={rawData?.pagination}
            paginationMode="server"
            rowHeight={60}
            // showToolbar
            loading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomsAndPricingBulkEditTable;
