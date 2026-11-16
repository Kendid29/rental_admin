'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';

import { Divider, IconButton, ListItemIcon, MenuItem } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';

import DataGrid from '@/components/mui/DataGrid';
import Menu from '@/components/mui/Menu';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import InlineStatusToggle from '@/components/ui/InlineStatusToggle';
import { environment } from '@/constant';
import useTablePagination from '@/lib/hooks/useTablePagination';
import { usePermission } from '@/services/permission/usePermission';
import useQuickToggleStatus from '@/services/useQuickToggleStatus';
import useDeleteVoucherCategory from '@/services/voucher-category/useDeleteVoucherCategory';
import useGetVoucherCategories from '@/services/voucher-category/useGetVoucherCategories';

import VoucherCategoryTableToolbar, {
  VoucherCategoryTableToolbarProps,
} from './VoucherCategoryTableToolbar';

const VoucherCategoryTable = () => {
  const checkPermission = usePermission();

  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [uuid, setUuid] = useState('');

  const { data: rawData, isLoading } = useGetVoucherCategories({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
    },
  });

  const { mutate, isPending } = useDeleteVoucherCategory();
  const {
    mutate: toggleStatus,
    isPending: isToggling,
    variables: toggleVariables,
  } = useQuickToggleStatus();

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
      field: 'queue',
      headerName: 'Queue',
      flex: 1,
      valueGetter: (_, row) => row.queue || '-',
    },
    {
      field: 'is_published',
      headerName: 'Published',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <InlineStatusToggle
          checked={Boolean(params.row.is_published)}
          loading={isToggling && toggleVariables?.item.uuid === params.row.uuid}
          disabled={!checkPermission('voucher_category', 'Update')}
          label={`Published status for ${params.row.name}`}
          onChange={(value) =>
            toggleStatus({ entity: 'voucher-category', item: params.row, value })
          }
        />
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
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
              href={`/dashboard/voucher-category/${params.row.uuid}`}
              disabled={!checkPermission('voucher_category', 'Update')}
            >
              <ListItemIcon>
                <Pencil size={'1rem'} />
              </ListItemIcon>
              Edit
            </MenuItem>
            {environment !== 'prod' && (
              <React.Fragment>
                <Divider key="voucher-category-divider" className="-mx-4 my-1" />
                <MenuItem
                  key="voucher-category-delete"
                  className="text-red-500"
                  onClick={() => setUuid(params.row.uuid)}
                  disabled={!checkPermission('voucher_category', 'Delete')}
                >
                  <ListItemIcon>
                    <Trash2 size={'1rem'} className="text-red-500" />
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
          loading={isLoading}
          checkboxSelection={false}
          slotProps={{
            toolbar: {
              onSearch: (val) => setSearch(val),
            } as VoucherCategoryTableToolbarProps,
          }}
          slots={{
            toolbar: VoucherCategoryTableToolbar as any,
          }}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationResponse={rawData?.pagination}
          paginationMode="server"
          showToolbar
        />
      </div>
      <DeleteConfirmationModal
        open={!!uuid}
        onClose={() => setUuid('')}
        onConfirm={() =>
          mutate(
            { uuid, version: data.find((item) => item.uuid === uuid)?.version },
            {
              onSuccess() {
                setUuid('');
              },
            },
          )
        }
        loading={isPending}
        title="Delete Voucher Category"
        content="Are you sure you want to delete this voucher category? This action cannot be undone."
      />
    </>
  );
};

export default VoucherCategoryTable;
