'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';

import { Chip, Divider, IconButton, ListItemIcon, MenuItem } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';

import DataGrid from '@/components/mui/DataGrid';
import Menu from '@/components/mui/Menu';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import InlineImageUpload from '@/components/ui/InlineImageUpload';
import InlineStatusToggle from '@/components/ui/InlineStatusToggle';
import { environment } from '@/constant';
import useTablePagination from '@/lib/hooks/useTablePagination';
import DiningType from '@/lib/types/dining.type';
import generateCreatedUpdatedColumn from '@/lib/utils/generateCreatedUpdatedColumn';
import useDeleteDining from '@/services/dining/useDeleteDining';
import useGetDinings from '@/services/dining/useGetDinings';
import { usePermission } from '@/services/permission/usePermission';
import useQuickToggleStatus from '@/services/useQuickToggleStatus';
import useQuickUpdateFeatureImage from '@/services/useQuickUpdateFeatureImage';

import DiningTableToolbar, { DiningTableToolbarProps } from './DiningTableToolbar';

const DiningTable = () => {
  const checkPermission = usePermission();

  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [uuid, setUuid] = useState('');
  const [dishType, setDishType] = useState('');

  const { data: rawData, isLoading } = useGetDinings({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
      dish_type: dishType,
    },
  });

  const { mutate, isPending } = useDeleteDining();
  const {
    mutate: toggleStatus,
    isPending: isToggling,
    variables: toggleVariables,
  } = useQuickToggleStatus();
  const {
    mutate: updateImage,
    isPending: isUpdatingImage,
    variables: imageVariables,
  } = useQuickUpdateFeatureImage();

  const data = useMemo(() => {
    return rawData?.data
      ? rawData.data.map((item: DiningType) => ({
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
      renderCell: (params) => (
        <InlineImageUpload
          imageUrl={params.row.photo?.[0]?.url}
          alt={params.row.name}
          loading={isUpdatingImage && imageVariables?.uuid === params.row.uuid}
          disabled={!checkPermission('dining', 'Update')}
          onUpload={(file) => updateImage({ entity: 'dining', uuid: params.row.uuid, file })}
        />
      ),
    },
    {
      field: 'name',
      headerName: 'Name',
      hideable: false,
      flex: 2,
    },
    {
      field: 'dining_dish_types',
      headerName: 'Dish Types',
      flex: 2,
      renderCell(params) {
        return (
          <div className="flex h-full flex-wrap items-center gap-2">
            {params.row.dining_dish_types
              .slice(0, 2)
              .map((item: DiningType['dining_dish_types'][number]) => (
                <Chip size="small" key={item.uuid} label={item.dish_type} />
              ))}
            {params.row.dining_dish_types.length > 2 && (
              <Chip size="small" label={`+${params.row.dining_dish_types.length - 2}`} />
            )}
          </div>
        );
      },
    },
    {
      field: 'code',
      headerName: 'Code',
      flex: 1,
      valueGetter: (_, v) => v.code || '-',
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      valueGetter: (_, v) => v.description || '-',
    },
    // {
    //   field: 'price',
    //   headerName: 'Price',
    //   flex: 1,
    //   valueGetter: (_, v) => `Rp ${v.price.toLocaleString()}`,
    // },
    {
      field: 'is_published_cms',
      headerName: 'Is Published',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <InlineStatusToggle
          checked={Boolean(params.row.is_published_cms)}
          loading={isToggling && toggleVariables?.item.uuid === params.row.uuid}
          disabled={!checkPermission('dining', 'Update')}
          label={`Published status for ${params.row.name}`}
          onChange={(value) => toggleStatus({ entity: 'dining', item: params.row, value })}
        />
      ),
    },
    ...generateCreatedUpdatedColumn(),
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
              href={`/dashboard/dining/${params.value}`}
              disabled={!checkPermission('dining', 'Update')}
            >
              <ListItemIcon>
                <Pencil size={'1rem'} />
              </ListItemIcon>
              Edit
            </MenuItem>
            {environment !== 'prod' && (
              <React.Fragment>
                <Divider key="dining-divider" className="-mx-4 my-1" />
                <MenuItem
                  key="dining-delete"
                  className="text-red-500"
                  onClick={() => setUuid(params.value)}
                  disabled={!checkPermission('dining', 'Delete')}
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
              onSearch: (val: string) => setSearch(val),
              dishType,
              onDishTypeChange: setDishType,
            } as DiningTableToolbarProps,
          }}
          slots={{
            toolbar: DiningTableToolbar as any,
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
            { uuid, version: data.find((item: DiningType) => item.uuid === uuid)?.version },
            {
              onSuccess() {
                setUuid('');
              },
            },
          )
        }
        loading={isPending}
        title="Delete Dining"
        content="Are you sure you want to delete this dining option? This action cannot be undone."
      />
    </>
  );
};

export default DiningTable;
