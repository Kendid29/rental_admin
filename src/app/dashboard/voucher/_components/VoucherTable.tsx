'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';

import {
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  ListItemIcon,
  MenuItem,
  Switch,
  Tooltip,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { EllipsisVertical, ImageUp, Pencil, Trash2 } from 'lucide-react';

import ImageContainer from '@/components/ImageContainer';
import DataGrid from '@/components/mui/DataGrid';
import Menu from '@/components/mui/Menu';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import { environment } from '@/constant';
import useTablePagination from '@/lib/hooks/useTablePagination';
import formatToRp from '@/lib/utils/formatToRp';
import { usePermission } from '@/services/permission/usePermission';
import useDeleteVoucher from '@/services/voucher/useDeleteVoucher';
import useGetVouchers from '@/services/voucher/useGetVouchers';
import useQuickUpdateVoucher from '@/services/voucher/useQuickUpdateVoucher';

import VoucherTableToolbar, { VoucherTableToolbarProps } from './VoucherTableToolbar';

const VoucherTable = () => {
  const checkPermission = usePermission();

  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [uuid, setUuid] = useState('');
  const [voucherCategory, setVoucherCategory] = useState('');
  const [voucherType, setVoucherType] = useState('');

  const { data: rawData, isLoading } = useGetVouchers({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
      voucher_category_uuid: voucherCategory,
      voucher_type: voucherType,
    },
  });

  const { mutate, isPending } = useDeleteVoucher();
  const {
    mutate: quickUpdate,
    isPending: isQuickUpdating,
    variables: quickUpdateVariables,
  } = useQuickUpdateVoucher();

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
      field: 'photo',
      headerName: 'Image',
      width: 120,
      sortable: false,
      renderCell(params) {
        const updating = isQuickUpdating && quickUpdateVariables?.uuid === params.row.uuid;

        return (
          <div className="flex h-full items-center gap-2 py-1">
            <div className="flex size-12 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50">
              {params.row.photo?.url ? (
                <ImageContainer
                  src={params.row.photo.url}
                  alt={params.row.name}
                  className="size-full object-cover"
                />
              ) : (
                <ImageUp className="text-gray-400" size="1.1rem" />
              )}
            </div>
            <Tooltip title="Update image">
              <span>
                <IconButton
                  component="label"
                  size="small"
                  disabled={updating || !checkPermission('voucher', 'Update')}
                  aria-label={`Update image for ${params.row.name}`}
                >
                  {updating ? <CircularProgress size={16} /> : <ImageUp size="1rem" />}
                  <input
                    hidden
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(event) => {
                      const file = event.target.files?.[0];

                      if (file) quickUpdate({ uuid: params.row.uuid, photo: file });
                      event.target.value = '';
                    }}
                  />
                </IconButton>
              </span>
            </Tooltip>
          </div>
        );
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      hideable: false,
      flex: 2,
      valueGetter: (_, row) => row.name,
    },
    {
      field: 'code',
      headerName: 'Code',
      hideable: false,
      flex: 1,
      valueGetter: (_, row) => row.code || '-',
    },
    {
      field: 'voucher_category',
      headerName: 'Category',
      flex: 2,
      valueGetter: (_, row) => row.voucher_category.name || '-',
    },
    {
      field: 'voucher_type',
      headerName: 'Type',
      flex: 1,
      renderCell(params) {
        return (
          <Chip
            label={params.row.voucher_type}
            size="small"
            color={params.row.voucher_type === 'percentage' ? 'info' : 'success'}
          />
        );
      },
    },
    {
      field: 'discount_percentage',
      headerName: 'Discount Percentage',
      flex: 2,
      valueGetter: (_, row) =>
        row.discount_percentage ? `${Number(row.discount_percentage).toFixed(2)}%` : '-',
    },
    {
      field: 'discount_nominal',
      headerName: 'Discount Nominal',
      flex: 2,
      valueGetter: (_, row) => (row.discount_nominal ? formatToRp(row.discount_nominal) : '-'),
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      valueGetter: (_, row) => row.quantity || '-',
    },
    {
      field: 'maximum_discount',
      headerName: 'Maximum Discount',
      flex: 2,
      valueGetter: (_, row) => (row.maximum_discount ? formatToRp(row.maximum_discount) : '-'),
    },
    {
      field: 'is_published',
      headerName: 'Published',
      width: 110,
      sortable: false,
      renderCell(params) {
        const checked = Boolean(params.row.is_published === true || params.row.is_published === 1);
        const updating =
          isQuickUpdating &&
          quickUpdateVariables?.uuid === params.row.uuid &&
          quickUpdateVariables.published !== undefined;

        return (
          <Switch
            size="small"
            checked={checked}
            disabled={updating || !checkPermission('voucher', 'Update')}
            onChange={(_, value) => quickUpdate({ uuid: params.row.uuid, published: value })}
            inputProps={{ 'aria-label': `Published status for ${params.row.name}` }}
          />
        );
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 3,
      valueGetter: (_, row) => row.description || '-',
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
              href={`/dashboard/voucher/${params.row.uuid}`}
              className="gap-2"
              disabled={!checkPermission('voucher', 'Update')}
            >
              <ListItemIcon>
                <Pencil size="1rem" />
              </ListItemIcon>
              Edit
            </MenuItem>
            {environment !== 'prod' && (
              <React.Fragment>
                <Divider key="voucher-divider" className="-mx-4 my-1" />
                <MenuItem
                  key="voucher-delete"
                  className="gap-2 text-red-500"
                  onClick={() => setUuid(params.row.uuid)}
                  disabled={!checkPermission('voucher', 'Delete')}
                >
                  <ListItemIcon>
                    <Trash2 size="1rem" className="text-red-500" />
                  </ListItemIcon>
                  Delete
                </MenuItem>
              </React.Fragment>
            )}
          </Menu>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex h-1 flex-grow flex-col pb-16">
        <DataGrid
          rows={data}
          columns={columns}
          checkboxSelection={false}
          slotProps={{
            toolbar: {
              onSearch: (val) => setSearch(val),
              voucherCategory,
              onVoucherCategoryChange: setVoucherCategory,
              voucherType,
              onVoucherTypeChange: setVoucherType,
            } as VoucherTableToolbarProps,
          }}
          slots={{
            toolbar: VoucherTableToolbar as any,
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
        title="Delete Voucher"
        content="Are you sure you want to delete this voucher? This action cannot be undone."
      />
    </>
  );
};

export default VoucherTable;
