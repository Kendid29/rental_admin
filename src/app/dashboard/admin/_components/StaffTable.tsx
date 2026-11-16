'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';

import { Divider, IconButton, ListItemIcon, MenuItem } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { parsePhoneNumber } from 'libphonenumber-js/min';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';

import DataGrid from '@/components/mui/DataGrid';
import Menu from '@/components/mui/Menu';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import { environment } from '@/constant';
import useTablePagination from '@/lib/hooks/useTablePagination';
import useDeleteStaff from '@/services/admin/useDeleteStaff';
import useGetStaffs from '@/services/admin/useGetStaffs';
import { usePermission } from '@/services/permission/usePermission';

import StaffTableToolbar, { StaffTableToolbarProps } from './StaffTableToolbar';

const StaffTable = () => {
  const checkPermission = usePermission();

  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [uuid, setUuid] = useState('');
  const [role, setRole] = useState<string>('');

  const { data: rawData, isLoading } = useGetStaffs({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
      role_uuid: role,
    },
  });

  const { mutate, isPending } = useDeleteStaff();

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
      headerName: 'Name',
      hideable: false,
      flex: 2,
      valueGetter: (__, row) => row.name,
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      valueGetter: (_, v) => v.role?.name,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      valueGetter: (_, v) => v.user?.email,
    },
    {
      field: 'phone_number',
      headerName: 'Phone Number',
      flex: 1,
      valueGetter: (_, v) =>
        v.phone_number ? parsePhoneNumber(v.phone_number, 'ID').formatInternational() : '-',
    },
    // {
    //   field: 'role_name',
    //   headerName: 'Role',
    //   flex: 1,
    //   valueGetter: (_, v) => v.role.name,
    // },
    // ...generateCreatedUpdatedColumn(),
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
              href={`/dashboard/admin/${params.value}`}
              disabled={!checkPermission('user', 'Update')}
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
                  key="delete-staff"
                  className="text-red-500"
                  onClick={() => setUuid(params.value)}
                  disabled={!checkPermission('user', 'Delete')}
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
            } as StaffTableToolbarProps,
          }}
          slots={{
            toolbar: StaffTableToolbar as any,
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
            { uuid, version: data.find((item: any) => item.uuid === uuid)?.version },
            {
              onSuccess() {
                setUuid('');
              },
            },
          )
        }
        loading={isPending}
        title="Delete Staff"
        content="Are you sure you want to delete this staff? This action cannot be undone."
      />
    </>
  );
};

export default StaffTable;
