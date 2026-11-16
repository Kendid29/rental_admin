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
import useDeleteMeetingLayout from '@/services/meeting-layout/useDeleteMeetingLayout';
import useGetMeetingLayouts from '@/services/meeting-layout/useGetMeetingLayouts';
import useQuickUpdateMeetingLayoutImage from '@/services/meeting-layout/useQuickUpdateMeetingLayoutImage';
import { usePermission } from '@/services/permission/usePermission';
import useQuickToggleStatus from '@/services/useQuickToggleStatus';

import MeetingLayoutTableToolbar, {
  MeetingLayoutTableToolbarProps,
} from './MeetingLayoutTableToolbar';

const MeetingLayoutTable = () => {
  const checkPermission = usePermission();

  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [uuid, setUuid] = useState('');

  const { data: rawData, isLoading } = useGetMeetingLayouts({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
    },
  });

  const { mutate, isPending } = useDeleteMeetingLayout();
  const {
    mutate: updateImage,
    isPending: isUpdatingImage,
    variables: imageVariables,
  } = useQuickUpdateMeetingLayoutImage();
  const {
    mutate: toggleStatus,
    isPending: isToggling,
    variables: toggleVariables,
  } = useQuickToggleStatus();

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
      valueGetter: (_, row) => row.name,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center overflow-hidden rounded border border-gray-200 bg-gray-50">
            {params.row.photo ? (
              <ImageContainer
                src={params.row.photo.url}
                alt={params.row.name}
                className="size-full object-cover"
              />
            ) : (
              <ImageUp className="text-gray-400" size="1rem" />
            )}
          </div>
          <Tooltip title="Update image">
            <span>
              <IconButton
                component="label"
                size="small"
                disabled={
                  (isUpdatingImage && imageVariables?.item.uuid === params.row.uuid) ||
                  !checkPermission('layout', 'Update')
                }
                aria-label={`Update image for ${params.row.name}`}
              >
                {isUpdatingImage && imageVariables?.item.uuid === params.row.uuid ? (
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

                    if (file) updateImage({ item: params.row, file });
                    event.target.value = '';
                  }}
                />
              </IconButton>
            </span>
          </Tooltip>
          <span>{params.row.name}</span>
        </div>
      ),
    },
    {
      field: 'code',
      headerName: 'Code',
      hideable: false,
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
      field: 'is_published_cms',
      headerName: 'Is Published',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <InlineStatusToggle
          checked={Boolean(params.row.is_published_cms)}
          loading={isToggling && toggleVariables?.item.uuid === params.row.uuid}
          disabled={!checkPermission('layout', 'Update')}
          label={`Published status for ${params.row.name}`}
          onChange={(value) => toggleStatus({ entity: 'meeting-layout', item: params.row, value })}
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
              href={`/dashboard/meeting-layout/${params.row.uuid}`}
              className="gap-2"
              disabled={!checkPermission('layout', 'Update')}
            >
              <ListItemIcon>
                <Pencil size="1rem" />
              </ListItemIcon>
              Edit
            </MenuItem>
            {environment !== 'prod' && (
              <React.Fragment>
                <Divider key="meeting-layout-divider" className="-mx-4 my-1" />
                <MenuItem
                  key="meeting-layout-delete"
                  className="gap-2 text-red-500"
                  onClick={() => setUuid(params.row.uuid)}
                  disabled={!checkPermission('layout', 'Delete')}
                >
                  <ListItemIcon>
                    <Trash2 size="1rem" className="text-red-500" />
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
            } as MeetingLayoutTableToolbarProps,
          }}
          slots={{
            toolbar: MeetingLayoutTableToolbar as any,
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
        title="Delete Meeting Layout"
        content="Are you sure you want to delete this meeting layout? This action cannot be undone."
      />
    </>
  );
};

export default MeetingLayoutTable;
