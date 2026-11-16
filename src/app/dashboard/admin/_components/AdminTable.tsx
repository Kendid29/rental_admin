'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';

import { Chip, Divider, IconButton, ListItemIcon, MenuItem } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { parsePhoneNumber } from 'libphonenumber-js/min';
import { EllipsisVertical, Pencil, Power, PowerOff, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

import DataGrid from '@/components/mui/DataGrid';
import Menu from '@/components/mui/Menu';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import useTablePagination from '@/lib/hooks/useTablePagination';
import useDeleteAdmin from '@/services/admin/useDeleteAdmin';
import useGetAdmins from '@/services/admin/useGetAdmins';
import useUpdateAdmin from '@/services/admin/useUpdateAdmin';
import { usePermission } from '@/services/permission/usePermission';

import AdminTableToolbar, { AdminTableToolbarProps } from './AdminTableToolbar';

const AdminTable = () => {
  const checkPermission = usePermission();

  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [deleteUuid, setDeleteUuid] = useState('');
  const [role, setRole] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const {
    data: rawData,
    isLoading,
    refetch,
  } = useGetAdmins({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
      role_uuid: role,
      status,
    },
  });

  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();

  // For quick toggle status
  const [activeToggleUuid, setActiveToggleUuid] = useState<string>('');
  const { mutate: updateAdmin } = useUpdateAdmin(activeToggleUuid);

  const handleToggleStatus = (targetAdmin: any) => {
    setActiveToggleUuid(targetAdmin.uuid);
    const newStatus = targetAdmin.status === 'aktif' ? 'tidak_aktif' : 'aktif';

    updateAdmin(
      {
        name: targetAdmin.name,
        email: targetAdmin.user?.email || '',
        phone_number: targetAdmin.phone_number || '',
        role_uuid: targetAdmin.role?.uuid || '',
        status: newStatus,
        version: targetAdmin.version,
      },
      {
        onSuccess() {
          toast(
            `Admin ${newStatus === 'aktif' ? 'berhasil diaktifkan' : 'berhasil dinonaktifkan'}`,
            { type: 'success' },
          );
          refetch();
        },
        onError() {
          toast('Gagal mengubah status admin', { type: 'error' });
        },
      },
    );
  };

  const data = useMemo(() => {
    return rawData?.data
      ? rawData.data.map((item: any) => ({
          ...item,
          id: item.uuid,
        }))
      : [];
  }, [rawData]);

  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: 'name',
      headerName: 'Nama Admin',
      hideable: false,
      flex: 1.5,
      valueGetter: (__, row) => row.name,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.5,
      valueGetter: (_, v) => v.user?.email,
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      valueGetter: (_, v) => v.role?.name,
    },
    {
      field: 'phone_number',
      headerName: 'Nomor Telepon',
      flex: 1.2,
      valueGetter(_, v) {
        try {
          return v.phone_number
            ? parsePhoneNumber(v.phone_number, 'ID').formatInternational()
            : '-';
        } catch {
          return v.phone_number || '-';
        }
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell({ row }) {
        const isAktif = row.status !== 'tidak_aktif';

        return (
          <Chip
            size="small"
            label={isAktif ? 'Aktif' : 'Tidak Aktif'}
            color={isAktif ? 'success' : 'default'}
            variant={isAktif ? 'filled' : 'outlined'}
            className="font-medium"
          />
        );
      },
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
        const row = params.row;
        const isAktif = row.status !== 'tidak_aktif';

        return (
          <Menu
            Button={IconButton}
            buttonProps={{
              children: <EllipsisVertical size={'1rem'} />,
            }}
          >
            <MenuItem
              component={Link}
              href={`/dashboard/admin/${params.value}`}
              disabled={!checkPermission('admin', 'Update')}
            >
              <ListItemIcon>
                <Pencil size={'1rem'} />
              </ListItemIcon>
              Edit
            </MenuItem>

            <MenuItem
              onClick={() => handleToggleStatus(row)}
              disabled={!checkPermission('admin', 'Update')}
            >
              <ListItemIcon>
                {isAktif ? (
                  <PowerOff size={'1rem'} className="text-amber-500" />
                ) : (
                  <Power size={'1rem'} className="text-emerald-500" />
                )}
              </ListItemIcon>
              {isAktif ? 'Nonaktifkan' : 'Aktifkan'}
            </MenuItem>

            <Divider key="delete-divider" className="-mx-4 my-1" />
            <MenuItem
              key="delete-admin"
              className="text-red-500"
              onClick={() => setDeleteUuid(params.value)}
              disabled={!checkPermission('admin', 'Delete')}
            >
              <ListItemIcon>
                <Trash2 size={'1rem'} className="text-red-500" />
              </ListItemIcon>
              Hapus
            </MenuItem>
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
              role,
              onRoleChange: setRole,
              status,
              onStatusChange: setStatus,
            } as AdminTableToolbarProps,
          }}
          slots={{
            toolbar: AdminTableToolbar as any,
          }}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationResponse={rawData?.pagination}
          paginationMode="server"
          showToolbar
        />
      </div>
      <DeleteConfirmationModal
        open={!!deleteUuid}
        onClose={() => setDeleteUuid('')}
        onConfirm={() =>
          deleteAdmin(
            {
              uuid: deleteUuid,
              version: data.find((item: any) => item.uuid === deleteUuid)?.version,
            },
            {
              onSuccess() {
                setDeleteUuid('');
                toast('Admin berhasil dihapus', { type: 'success' });
                refetch();
              },
            },
          )
        }
        loading={isDeleting}
        title="Hapus Admin"
        content="Apakah Anda yakin ingin menghapus akun administrator ini? Tindakan ini tidak dapat dibatalkan."
      />
    </>
  );
};

export default AdminTable;
