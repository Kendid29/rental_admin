'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';

import { Divider, IconButton, ListItemIcon, MenuItem } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';


import DataGrid from '@/components/mui/DataGrid';
import Menu from '@/components/mui/Menu';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import SafeDynamicIcon from '@/components/ui/SafeDynamicIcon';
import { environment } from '@/constant';
import useTablePagination from '@/lib/hooks/useTablePagination';
import { usePermission } from '@/services/permission/usePermission';
import useDeleteRoomFacility from '@/services/room-facilities/useDeleteRoomFacility';
import useGetRoomFacilities from '@/services/room-facilities/useGetRoomFacilities';

import RoomFacilitiesTableToolbar, {
  RoomFacilitiesTableToolbarProps,
} from './RoomFacilitiesTableToolbar';

const RoomFacilitiesTable = () => {
  const checkPermission = usePermission();

  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [uuid, setUuid] = useState('');

  const { data: rawData, isLoading } = useGetRoomFacilities({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
    },
  });

  const { mutate, isPending } = useDeleteRoomFacility();

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
      headerName: 'Facility Name',
      hideable: false,
      flex: 2,
      renderCell: ({ row }) => (
        <span className="flex items-center gap-2">
          {row.icon_title && <SafeDynamicIcon size={'1rem'} name={row.icon_title} />}
          {row.name}
        </span>
      ),
    },
    {
      field: 'code',
      headerName: 'Code',
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
              href={`/dashboard/room-facilities/${params.value}`}
              disabled={!checkPermission('facility', 'Update')}
            >
              <ListItemIcon>
                <Pencil size={'1rem'} />
              </ListItemIcon>
              Edit
            </MenuItem>
            {environment !== 'prod' && (
              <React.Fragment>
                <Divider key="room-facility-divider" className="-mx-4 my-1" />
                <MenuItem
                  key="room-facility-delete"
                  className="text-red-500"
                  onClick={() => setUuid(params.value)}
                  disabled={!checkPermission('facility', 'Delete')}
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
            } as RoomFacilitiesTableToolbarProps,
          }}
          slots={{
            toolbar: RoomFacilitiesTableToolbar as any,
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
        title="Delete Room Facility"
        content="Are you sure you want to delete this room facility? This action cannot be undone."
      />
    </>
  );
};

export default RoomFacilitiesTable;
