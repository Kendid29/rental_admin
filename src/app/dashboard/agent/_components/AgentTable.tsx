'use client';

import React, { useMemo } from 'react';

import Link from 'next/link';

import { Divider, IconButton, ListItemIcon, MenuItem } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { EllipsisVertical, Eye, Pencil, Trash2 } from 'lucide-react';

import DataGrid from '@/components/mui/DataGrid';
import Menu from '@/components/mui/Menu';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import { environment } from '@/constant';
import useTablePagination from '@/lib/hooks/useTablePagination';
import useDeleteAgent from '@/services/agent/useDeleteAgent';
import useGetAgents from '@/services/agent/useGetAgents';
import { usePermission } from '@/services/permission/usePermission';

import AgentTableToolbar, { AgentTableToolbarProps } from './AgentTableToolbar';

const AgentTable = () => {
  const checkPermission = usePermission();
  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [uuid, setUuid] = React.useState('');

  const { mutate, isPending } = useDeleteAgent();

  const { data: rawData, isLoading } = useGetAgents({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
    },
  });

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
      valueGetter: (_, v) => v.email,
    },
    {
      field: 'phone_number',
      headerName: 'Phone Number',
      flex: 1,
      valueGetter: (_, v) => v.phone_number || '-',
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 1,
      valueGetter: (_, v) => v.location || '-',
    },
    {
      field: 'company',
      headerName: 'Company',
      flex: 1,
      valueGetter: (_, v) => v.company || '-',
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
            {checkPermission('user', 'Update') && (
              <MenuItem component={Link} href={`/dashboard/agent/${params.value}`}>
                <ListItemIcon>
                  <Pencil size={'1rem'} />
                </ListItemIcon>
                Edit
              </MenuItem>
            )}
            {environment !== 'prod' && (
              <>
                <Divider key="delete-divider" className="-mx-4 my-1" />
                <MenuItem
                  key="delete-agent"
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
    <div className="flex h-1 flex-grow flex-col pb-16">
      <DataGrid
        rows={data}
        columns={columns}
        loading={isLoading}
        checkboxSelection={false}
        slotProps={{
          toolbar: {
            onSearch: (val) => setSearch(val),
          } as AgentTableToolbarProps,
        }}
        slots={{
          toolbar: AgentTableToolbar as any,
        }}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        paginationResponse={rawData?.pagination}
        paginationMode="server"
        showToolbar
      />
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
        title="Delete Agent"
        content="Are you sure you want to delete this agent? This action cannot be undone."
      />
    </div>
  );
};

export default AgentTable;

