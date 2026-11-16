'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';

import { Divider, IconButton, ListItemIcon, MenuItem } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';

import DataGrid from '@/components/mui/DataGrid';
import Menu from '@/components/mui/Menu';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import InlineImageUpload from '@/components/ui/InlineImageUpload';
import InlineStatusToggle from '@/components/ui/InlineStatusToggle';
import { environment } from '@/constant';
import useTablePagination from '@/lib/hooks/useTablePagination';
import useDeletePackageTour from '@/services/package-tour/useDeletePackageTour';
import useGetPackageTours from '@/services/package-tour/useGetPackageTours';
import { usePermission } from '@/services/permission/usePermission';
import useQuickToggleStatus from '@/services/useQuickToggleStatus';
import useQuickUpdateFeatureImage from '@/services/useQuickUpdateFeatureImage';

import PackageTourTableToolbar, { PackageTourTableToolbarProps } from './PackageTourTableToolbar';

const PackageTourTable = () => {
  const checkPermission = usePermission();

  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [uuid, setUuid] = useState('');

  const { data: rawData, isLoading } = useGetPackageTours({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
    },
  });

  const { mutate, isPending } = useDeletePackageTour();
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
    return rawData
      ? rawData.data.map((item) => ({
          ...item,
          id: item.uuid,
        }))
      : [];
  }, [rawData]);

  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: 'image',
      headerName: 'Image',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <InlineImageUpload
          imageUrl={params.row.image?.url}
          alt={params.row.name}
          loading={isUpdatingImage && imageVariables?.uuid === params.row.uuid}
          disabled={!checkPermission('package_tour', 'Update')}
          onUpload={(file) => updateImage({ entity: 'package-tour', uuid: params.row.uuid, file })}
        />
      ),
    },
    {
      field: 'name',
      headerName: 'Package Tour Name',
      hideable: false,
      flex: 2,
      valueGetter: (_, row) => row.name,
    },
    {
      field: 'code',
      headerName: 'Code',
      flex: 1,
      valueGetter: (_, row) => row.code,
    },
    {
      field: 'is_active',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <InlineStatusToggle
          checked={Boolean(params.row.is_active)}
          loading={isToggling && toggleVariables?.item.uuid === params.row.uuid}
          disabled={!checkPermission('package_tour', 'Update')}
          label={`Status for ${params.row.name}`}
          onChange={(value) => toggleStatus({ entity: 'package-tour', item: params.row, value })}
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
              href={`/dashboard/tour-management/package-tour/${params.value}`}
              disabled={!checkPermission('package_tour', 'Update')}
            >
              <ListItemIcon>
                <Pencil size={'1rem'} />
              </ListItemIcon>
              Edit
            </MenuItem>
            {environment !== 'prod' && (
              <>
                <Divider key="delete-divider" className="-mx-4 my-1" />
                <MenuItem
                  key="delete-package-tour"
                  className="text-red-500"
                  onClick={() => setUuid(params.value)}
                  disabled={!checkPermission('package_tour', 'Delete')}
                >
                  <ListItemIcon>
                    <Trash2 size={'1rem'} className="text-red-500" />
                  </ListItemIcon>
                  Delete
                </MenuItem>
              </>
            )}
          </Menu>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex h-1 grow flex-col pb-16">
        <DataGrid
          rows={data}
          columns={columns}
          checkboxSelection={false}
          slotProps={{
            toolbar: {
              onSearch: (val) => setSearch(val),
            } as PackageTourTableToolbarProps,
          }}
          slots={{
            toolbar: PackageTourTableToolbar as any,
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
        title="Delete Package Tour"
        content="Are you sure you want to delete this Package Tour? This action cannot be undone."
      />
    </>
  );
};

export default PackageTourTable;
