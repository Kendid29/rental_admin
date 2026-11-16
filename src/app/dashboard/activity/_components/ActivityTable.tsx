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
import useTablePagination from '@/lib/hooks/useTablePagination';
import useDeleteActivity from '@/services/activity/useDeleteActivity';
import useGetActivities from '@/services/activity/useGetActivities';
import useUpdateActivity from '@/services/activity/useUpdateActivity';
import useQuickToggleStatus from '@/services/useQuickToggleStatus';

import ActivityTableToolbar, { ActivityTableToolbarProps } from './ActivityTableToolbar';

const ActivityTable = () => {
  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [uuid, setUuid] = useState('');

  const { data: rawData, isLoading } = useGetActivities({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
    },
  });

  const { mutate: deleteActivity, isPending: isDeleting } = useDeleteActivity();
  const {
    mutate: updateActivity,
    isPending: isUpdating,
    variables: updateVariables,
  } = useUpdateActivity();
  const {
    mutate: toggleStatus,
    isPending: isToggling,
    variables: toggleVariables,
  } = useQuickToggleStatus();

  const data = useMemo(() => {
    return rawData
      ? rawData.data.map((item) => ({
          ...item,
          id: item.uuid,
        }))
      : [];
  }, [rawData]);

  const handleDeleteConfirm = () => {
    if (!uuid) return;
    deleteActivity(
      { uuid, version: 1 },
      {
        onSuccess() {
          setUuid('');
        },
      },
    );
  };

  const handleImageUpdate = (item: any, image: File) => {
    updateActivity({
      uuid: item.uuid,
      data: {
        title: item.title,
        description: item.description,
        image,
        is_active: item.is_active,
      },
    });
  };

  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: 'image',
      headerName: 'Image',
      width: 120,
      sortable: false,
      renderCell(params) {
        return (
          <div className="flex h-full w-full items-center gap-2 py-1">
            <div className="flex h-full w-14 items-center justify-center overflow-hidden rounded-md border border-gray-100">
              <ImageContainer
                src={params.row.image?.url || ''}
                alt={params.row.title}
                className="h-full w-full object-cover"
              />
            </div>
            <Tooltip title="Update image">
              <span>
                <IconButton
                  component="label"
                  size="small"
                  disabled={isUpdating && updateVariables?.uuid === params.row.uuid}
                  aria-label={`Update image for ${params.row.title}`}
                >
                  {isUpdating && updateVariables?.uuid === params.row.uuid ? (
                    <CircularProgress size={16} />
                  ) : (
                    <ImageUp size="1rem" />
                  )}
                  <input
                    hidden
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(event) => {
                      const file = event.target.files?.[0];

                      if (file) handleImageUpdate(params.row, file);
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
      field: 'title',
      headerName: 'Title',
      hideable: false,
      flex: 2,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 3,
      valueGetter: (_, row) => row.description || '-',
    },
    {
      field: 'is_active',
      headerName: 'Status',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <InlineStatusToggle
          checked={Boolean(params.row.is_active)}
          loading={isToggling && toggleVariables?.item.uuid === params.row.uuid}
          label={`Status for ${params.row.title}`}
          onChange={(value) => toggleStatus({ entity: 'activity', item: params.row, value })}
        />
      ),
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
              href={`/dashboard/activity/${params.row.uuid}`}
              className="gap-2"
            >
              <ListItemIcon>
                <Pencil size="1rem" />
              </ListItemIcon>
              Edit
            </MenuItem>

            <Divider key="activity-divider" className="-mx-4 my-1" />
            <MenuItem
              key="activity-delete"
              className="gap-2 text-red-500"
              onClick={() => setUuid(params.row.uuid)}
            >
              <ListItemIcon>
                <Trash2 size="1rem" className="text-red-500" />
              </ListItemIcon>
              Delete
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
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationResponse={rawData?.pagination}
          paginationMode="server"
          disableRowSelectionOnClick
          disableMultipleRowSelection
          slotProps={{
            toolbar: {
              onSearch: (val) => setSearch(val),
            } as ActivityTableToolbarProps,
          }}
          slots={{
            toolbar: ActivityTableToolbar as any,
          }}
          showToolbar
        />
      </div>

      <DeleteConfirmationModal
        open={!!uuid}
        onClose={() => setUuid('')}
        onConfirm={handleDeleteConfirm}
        loading={isDeleting}
        title="Delete Activity"
        content="Are you sure you want to delete this activity? This action cannot be undone."
      />
    </>
  );
};

export default ActivityTable;
