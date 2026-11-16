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
import useGetPackageTourPricings from '@/services/package-tour-pricing/useGetPackageTourPricings';

import { parseDateRangeToDatesBySelectedDate } from '../../../../rooms-and-pricing/bulk-edit/_utils';
import { PackageTourPricingBulkEditFormType } from '../_utils/package-tour-pricing-bulk-edit-schema';

interface Props extends Omit<DialogProps, 'data'> {
  data: PackageTourPricingBulkEditFormType;
}

const PackageTourPricingBulkEditTable = ({ data, open, onClose, ...props }: Props) => {
  const { paginationModel, setPaginationModel } = useTablePagination();

  const datesFormatted = useMemo(() => {
    if (!data.date_range || !data.selected_days) return [];
    return parseDateRangeToDatesBySelectedDate(data.date_range, data.selected_days);
  }, [data.date_range, data.selected_days]);

  const { data: rawData, isLoading } = useGetPackageTourPricings({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      dates: datesFormatted.join(','),
      package_tour_uuids: data.package_tour_uuid || '',
    },
    enabled: !!data.date_range && !!data.package_tour_uuid && !!open,
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
      flex: 1.5,
      valueGetter: (_, row) => dayjs(row.date).format('DD MMMM YYYY'),
    },
    {
      field: 'package_tour.name',
      headerName: 'Package Tour',
      flex: 2,
      valueGetter: (_, row) => row.package_tour?.name || '-',
    },
    {
      field: 'base_price',
      headerName: 'Base Price',
      flex: 2,
      renderCell(params) {
        return (
          <div className="flex h-full flex-col justify-center">
            <Typography variant="caption" className="text-stone-400">
              Before: {formatToRp(params.row.base_price || 0)}
            </Typography>
            <Typography variant="caption" className="text-primary font-semibold">
              After: {formatToRp(data.base_price)}
            </Typography>
          </div>
        );
      },
    },
    {
      field: 'selling_price',
      headerName: 'Selling Price',
      flex: 2,
      renderCell(params) {
        return (
          <div className="flex h-full flex-col justify-center">
            <Typography variant="caption" className="text-stone-400">
              Before: {formatToRp(params.row.selling_price || 0)}
            </Typography>
            <Typography variant="caption" className="text-primary font-semibold">
              After: {formatToRp(data.selling_price)}
            </Typography>
          </div>
        );
      },
    },
    {
      field: 'quantity',
      headerName: 'Total Qty',
      flex: 1.5,
      renderCell(params) {
        return (
          <div className="flex h-full flex-col justify-center">
            <Typography variant="caption" className="text-stone-400">
              Before: {params.row.quantity || 0}
            </Typography>
            <Typography variant="caption" className="text-primary font-semibold">
              After: {data.quantity}
            </Typography>
          </div>
        );
      },
    },
    {
      field: 'is_published',
      headerName: 'Published',
      flex: 1.5,
      renderCell(params) {
        return (
          <div className="flex h-full flex-col justify-center">
            <Typography variant="caption" className="text-stone-400">
              Before: {params.row.is_published ? 'Yes' : 'No'}
            </Typography>
            <Typography variant="caption" className="text-primary font-semibold">
              After: {data.is_published ? 'Yes' : 'No'}
            </Typography>
          </div>
        );
      },
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl" {...props}>
      <DialogTitle className="flex justify-between">
        <span>Package Tour Pricing Preview</span>
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
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            paginationResponse={rawData?.pagination}
            paginationMode="server"
            rowHeight={65}
            loading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PackageTourPricingBulkEditTable;
