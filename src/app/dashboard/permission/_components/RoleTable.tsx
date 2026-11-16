'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';

import { Divider, IconButton, ListItemIcon, MenuItem } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { EllipsisVertical, Pencil, ShieldCheck, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

import DataGrid from '@/components/mui/DataGrid';
import Menu from '@/components/mui/Menu';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import useTablePagination from '@/lib/hooks/useTablePagination';
import useDeleteRole from '@/services/permission/useDeleteRole';
import useGetRoles from '@/services/permission/useGetRoles';
import { usePermission } from '@/services/permission/usePermission';

import RoleTableToolbar, { RoleTableToolbarProps } from './RoleTableToolbar';

const RoleTable = () => {
  const checkPermission = usePermission();

  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [uuid, setUuid] = useState('');

  const {
    data: rawData,
    isLoading,
    refetch,
  } = useGetRoles({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
    },
  });

  const { mutate, isPending } = useDeleteRole();

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
      field: 'name',
      headerName: 'Nama Role',
      hideable: false,
      flex: 1.5,
      valueGetter: (_, row) => row.name,
    },
    {
      field: 'code',
      headerName: 'Kode Role',
      flex: 1,
      valueGetter: (_, row) => row.code,
    },
    {
      field: 'description',
      headerName: 'Deskripsi',
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
        if (params.row.code.startsWith('master_admin')) return <></>;

        return (
          <Menu
            Button={IconButton}
            buttonProps={{
              children: <EllipsisVertical size={'1rem'} />,
            }}
          >
            <MenuItem
              key="role-permissions"
              component={Link}
              href={`/dashboard/permission/${params.value}/permission`}
              disabled={!checkPermission('permission', 'Read')}
            >
              <ListItemIcon>
                <ShieldCheck size={'1rem'} />
              </ListItemIcon>
              Konfigurasi Hak Akses
            </MenuItem>
            <MenuItem
              key="role-edit"
              component={params.row.is_default ? 'div' : Link}
              href={`/dashboard/permission/${params.value}`}
              disabled={!checkPermission('permission', 'Update') || params.row.is_default}
            >
              <ListItemIcon>
                <Pencil size={'1rem'} />
              </ListItemIcon>
              Edit
            </MenuItem>
            {!params.row.is_default && (
              <React.Fragment key="role-delete-fragment">
                <Divider key="role-divider" className="-mx-4 my-1" />
                <MenuItem
                  key="role-delete"
                  className="text-red-500"
                  onClick={() => setUuid(params.value)}
                  disabled={!checkPermission('permission', 'Delete')}
                >
                  <ListItemIcon>
                    <Trash2 size={'1rem'} className="text-red-500" />
                  </ListItemIcon>
                  Hapus
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
            } as RoleTableToolbarProps,
          }}
          slots={{
            toolbar: RoleTableToolbar as any,
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
                toast('Role berhasil dihapus', { type: 'success' });
                refetch();
              },
            },
          )
        }
        loading={isPending}
        title="Hapus Role"
        content="Apakah Anda yakin ingin menghapus role ini? Tindakan ini tidak dapat dibatalkan."
      />
    </>
  );
};

export default RoleTable;
