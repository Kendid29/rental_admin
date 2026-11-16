'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';

import {
  CircularProgress,
  Divider,
  IconButton,
  ListItemIcon,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { EllipsisVertical, ImageUp, Pencil, Trash2 } from 'lucide-react';

import ImageContainer from '@/components/ImageContainer';
import DataGrid from '@/components/mui/DataGrid';
import Menu from '@/components/mui/Menu';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import InlineStatusToggle from '@/components/ui/InlineStatusToggle';
import { environment } from '@/constant';
import useTablePagination from '@/lib/hooks/useTablePagination';
import { usePermission } from '@/services/permission/usePermission';
import useQuickToggleStatus from '@/services/useQuickToggleStatus';
import useDeleteVillaClass from '@/services/villa-class/useDeleteVillaClass';
import useGetVillaClasses from '@/services/villa-class/useGetVillaClasses';
import useQuickUpdateVillaImage from '@/services/villa-class/useQuickUpdateVillaImage';

import VillaClassTableToolbar, { VillaClassTableToolbarProps } from './VillaClassTableToolbar';

const VillaClassTable = () => {
  const checkPermission = usePermission();

  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [uuid, setUuid] = useState('');

  const { data: rawData, isLoading } = useGetVillaClasses({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
    },
  });

  const { mutate, isPending } = useDeleteVillaClass();
  const {
    mutate: toggleStatus,
    isPending: isToggling,
    variables: toggleVariables,
  } = useQuickToggleStatus();
  const {
    mutate: updateImage,
    isPending: isUpdatingImage,
    variables: imageVariables,
  } = useQuickUpdateVillaImage();

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
      field: 'thumbnail',
      headerName: 'Image',
      width: 120,
      sortable: false,
      renderCell(params) {
        const updating = isUpdatingImage && imageVariables?.uuid === params.row.uuid;

        return (
          <div className="flex h-full items-center gap-2 py-1">
            <div className="flex size-12 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50">
              {params.row.thumbnail?.url ? (
                <ImageContainer
                  src={params.row.thumbnail.url}
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
                  disabled={updating || !checkPermission('villa', 'Update')}
                  aria-label={`Update image for ${params.row.name}`}
                >
                  {updating ? <CircularProgress size={16} /> : <ImageUp size="1rem" />}
                  <input
                    hidden
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(event) => {
                      const file = event.target.files?.[0];

                      if (file) updateImage({ uuid: params.row.uuid, file });
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
      headerName: 'Villa Name',
      hideable: false,
      flex: 2,
      valueGetter: (_, row) => row.name,
    },
    {
      field: 'code',
      headerName: 'Code',
      flex: 1,
      valueGetter: (_, row) => row.code || '-',
    },
    {
      field: 'max_guest',
      headerName: 'Max Guests',
      flex: 1,
      valueGetter: (_, row) => row.max_guest || '-',
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 2,
      valueGetter: (_, row) => row.address || '-',
    },
    {
      field: 'is_active',
      headerName: 'Status',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <InlineStatusToggle
          checked={Boolean(params.row.is_active)}
          loading={isToggling && toggleVariables?.item.uuid === params.row.uuid}
          disabled={!checkPermission('villa', 'Update')}
          label={`Status for ${params.row.name}`}
          onChange={(value) => toggleStatus({ entity: 'villa-class', item: params.row, value })}
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
              href={`/dashboard/villa-class/${params.value}`}
              disabled={!checkPermission('villa', 'Update')}
            >
              <ListItemIcon>
                <Pencil size={'1rem'} />
              </ListItemIcon>
              Edit
            </MenuItem>
            {environment !== 'prod' && (
              <React.Fragment>
                <Divider key="villa-class-divider" className="-mx-4 my-1" />
                <MenuItem
                  key="villa-class-delete"
                  className="text-red-500"
                  onClick={() => setUuid(params.value)}
                  disabled={!checkPermission('villa', 'Delete')}
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
          checkboxSelection={false}
          slotProps={{
            toolbar: {
              onSearch: (val) => setSearch(val),
            } as VillaClassTableToolbarProps,
          }}
          slots={{
            toolbar: VillaClassTableToolbar as any,
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
        title="Delete Villa Class"
        content="Are you sure you want to delete this villa class? This action cannot be undone."
      />
    </>
  );
};

export default VillaClassTable;
