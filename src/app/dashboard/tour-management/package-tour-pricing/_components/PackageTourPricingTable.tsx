'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';

import { Chip, Divider, IconButton, ListItemIcon, MenuItem, Stack } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';

import DataGrid from '@/components/mui/DataGrid';
import Menu from '@/components/mui/Menu';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import { environment } from '@/constant';
import useTablePagination from '@/lib/hooks/useTablePagination';
import { cn } from '@/lib/utils';
import formatNumberWithCommas from '@/lib/utils/formatNumberWithComas';
import formatToRp from '@/lib/utils/formatToRp';
import { usePermission } from '@/services/permission/usePermission';
import useDeletePackageTourPricing from '@/services/package-tour-pricing/useDeletePackageTourPricing';
import useGetPackageTourPricings from '@/services/package-tour-pricing/useGetPackageTourPricings';

import PackageTourPricingTableToolbar, {
  PackageTourPricingTableToolbarProps,
} from './PackageTourPricingTableToolbar';

interface Props {
  date?: string;
}

const PackageTourPricingTable = ({ date }: Props) => {
  const checkPermission = usePermission();

  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [uuid, setUuid] = useState('');

  const { data: rawData, isLoading } = useGetPackageTourPricings({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
      date: date || '',
    },
    enabled: !!date,
  });

  const { mutate, isPending } = useDeletePackageTourPricing();

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
      field: 'package_tour.name',
      headerName: 'Package Tour',
      hideable: false,
      flex: 2,
      valueGetter: (_, row) => row.package_tour?.name || '-',
    },
    {
      field: 'villa_class.name',
      headerName: 'Villa Class',
      flex: 1.5,
      valueGetter: (_, row) => row.villa_class?.name || '-',
    },
    {
      field: 'min_qty',
      headerName: 'Min Pax',
      flex: 1,
      valueGetter: (_, row) => `${row.min_qty} Pax`,
    },
    {
      field: 'price_ranges',
      headerName: 'Price Summary',
      flex: 2,
      renderCell: (params) => {
        const ranges = params.row.price_ranges;
        if (!ranges || ranges.length === 0) return '-';

        return (
          <Stack direction="row" spacing={1} className="h-full items-center">
            {ranges.length === 1 ? (
              <Chip
                label={formatToRp(ranges[0].price)}
                size="small"
                variant="outlined"
                color="primary"
              />
            ) : (
              <Chip
                label={`${ranges.length} Ranges (Start ${formatToRp(ranges[0].price)})`}
                size="small"
                variant="outlined"
                color="info"
              />
            )}
          </Stack>
        );
      },
    },
    {
      field: 'quantity',
      headerName: 'Total Qty',
      flex: 1,
      valueGetter: (_, row) => formatNumberWithCommas((row.quantity || 0).toString()),
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
              component={Link}
              href={`/dashboard/tour-management/package-tour-pricing/${params.value}`}
              disabled={!checkPermission('package_tour_pricing', 'Update')}
            >
              <ListItemIcon>
                <Pencil size={'1rem'} />
              </ListItemIcon>
              Edit
            </MenuItem>
            {environment !== 'prod' && <Divider className="-mx-4 my-1" />}
            {environment !== 'prod' && (
              <MenuItem
                className="text-red-500"
                onClick={() => setUuid(params.value)}
                disabled={!checkPermission('package_tour_pricing', 'Delete')}
              >
                <ListItemIcon>
                  <Trash2 size={'1rem'} className="text-red-500" />
                </ListItemIcon>
                Delete
              </MenuItem>
            )}
          </Menu>
        );
      },
    },
  ];

  return (
    <>
      <div className="mb-2 flex h-[600px] flex-col">
        <DataGrid
          rows={data}
          columns={columns}
          checkboxSelection={false}
          slotProps={{
            toolbar: {
              onSearch: (val) => setSearch(val),
            } as PackageTourPricingTableToolbarProps,
          }}
          slots={{
            toolbar: PackageTourPricingTableToolbar as any,
          }}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationResponse={rawData?.pagination}
          paginationMode="server"
          showToolbar
          loading={isLoading}
        />
      </div>
      <DeleteConfirmationModal
        open={!!uuid}
        onClose={() => setUuid('')}
        onConfirm={() =>
          mutate(
            { uuid, version: data.find((item) => item.uuid === uuid)?.version || 0 },
            {
              onSuccess() {
                setUuid('');
              },
            },
          )
        }
        loading={isPending}
        title="Delete Package Tour Pricing"
        content="Are you sure you want to delete this Package Tour pricing? This action cannot be undone."
      />
    </>
  );
};

export default PackageTourPricingTable;
