'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';

import { Divider, IconButton, ListItemIcon, MenuItem } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';

import DataGrid from '@/components/mui/DataGrid';
import Menu from '@/components/mui/Menu';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import { environment } from '@/constant';
import useTablePagination from '@/lib/hooks/useTablePagination';
import { usePermission } from '@/services/permission/usePermission';
import useDeletePromotionCategory from '@/services/promotion-category/useDeletePromotionCategory';
import useGetPromotionCategories from '@/services/promotion-category/useGetPromotionCategories';

import PromotionCategoryTableToolbar, {
  PromotionCategoryTableToolbarProps,
} from './PromotionCategoryTableToolbar';

const PromotionCategoryTable = () => {
  const checkPermission = usePermission();

  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [uuid, setUuid] = useState('');

  const { data: rawData, isLoading } = useGetPromotionCategories({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
    },
  });

  const { mutate, isPending } = useDeletePromotionCategory();

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
              href={`/dashboard/promotion-category/${params.row.uuid}`}
              className="gap-2"
              disabled={!checkPermission('promo_category', 'Update')}
            >
              <ListItemIcon>
                <Pencil size="1rem" />
              </ListItemIcon>
              Edit
            </MenuItem>
            {environment !== 'prod' && (
              <React.Fragment>
                <Divider key="promotion-category-divider" className="-mx-4 my-1" />
                <MenuItem
                  key="promotion-category-delete"
                  className="gap-2 text-red-500"
                  onClick={() => setUuid(params.row.uuid)}
                  disabled={!checkPermission('promo_category', 'Delete')}
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
          loading={isLoading}
          checkboxSelection={false}
          slotProps={{
            toolbar: {
              onSearch: (val) => setSearch(val),
            } as PromotionCategoryTableToolbarProps,
          }}
          slots={{
            toolbar: PromotionCategoryTableToolbar as any,
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
        title="Delete Promotion Category"
        content="Are you sure you want to delete this promotion category? This action cannot be undone."
      />
    </>
  );
};

export default PromotionCategoryTable;
