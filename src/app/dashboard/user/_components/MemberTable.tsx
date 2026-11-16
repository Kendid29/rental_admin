'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';

import { Divider, IconButton, ListItemIcon, MenuItem } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import dayjs from 'dayjs';
import { parsePhoneNumber } from 'libphonenumber-js/min';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';

import DataGrid from '@/components/mui/DataGrid';
import Menu from '@/components/mui/Menu';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import { environment } from '@/constant';
import useTablePagination from '@/lib/hooks/useTablePagination';
import { usePermission } from '@/services/permission/usePermission';
import useDeleteMember from '@/services/user/useDeleteMember';
import useGetMembers from '@/services/user/useGetMembers';

import MemberTableToolbar, { MemberTableToolbarProps } from './MemberTableToolbar';

const MemberTable = () => {
  const checkPermission = usePermission();

  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [uuid, setUuid] = useState('');

  const { data: rawData, isLoading } = useGetMembers({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
    },
  });

  const { mutate, isPending } = useDeleteMember();

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
      valueGetter: (__, row) => row.name,
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
    {
      field: 'birth_date',
      headerName: 'Birth Date',
      flex: 1,
      valueGetter: (_, v) => dayjs(v.birth_date).format('DD MMMM YYYY'),
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 2,
      valueGetter: (_, v) => v.address || v.location || '-',
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
              href={`/dashboard/user/${params.value}`}
              disabled={!checkPermission('user', 'Update')}
            >
              <ListItemIcon>
                <Pencil size={'1rem'} />
              </ListItemIcon>
              Edit
            </MenuItem>

            {environment !== 'prod' && (
              <React.Fragment>
                <Divider key="member-divider" className="-mx-4 my-1" />
                <MenuItem
                  key="member-delete"
                  className="text-red-500"
                  onClick={() => setUuid(params.value)}
                  disabled={!checkPermission('user', 'Delete')}
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
            } as MemberTableToolbarProps,
          }}
          slots={{
            toolbar: MemberTableToolbar as any,
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
        title="Delete Member"
        content="Are you sure you want to delete this member? This action cannot be undone."
      />
    </>
  );
};

export default MemberTable;
