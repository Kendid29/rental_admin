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
import { MeetingEventsType } from '@/lib/types/meeting-events.type';
import generateCreatedUpdatedColumn from '@/lib/utils/generateCreatedUpdatedColumn';
import useDeleteMeetingEvents from '@/services/meeting-events/useDeleteMeetingEvents';
import useGetMeetingEvents from '@/services/meeting-events/useGetMeetingEvents';
import { usePermission } from '@/services/permission/usePermission';
import useQuickToggleStatus from '@/services/useQuickToggleStatus';
import useQuickUpdateFeatureImage from '@/services/useQuickUpdateFeatureImage';

import MeetingEventsTableToolbar, {
  MeetingEventsTableToolbarProps,
} from './MeetingEventsTableToolbar';

const MeetingEventsTable = () => {
  const checkPermission = usePermission();

  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [uuid, setUuid] = useState('');
  const [meetingPackage, setMeetingPackage] = useState('');
  const [meetingLayout, setMeetingLayout] = useState('');

  const { data: rawData, isLoading } = useGetMeetingEvents({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
      meeting_package_uuid: meetingPackage,
      layout_uuid: meetingLayout,
    },
  });

  const { mutate, isPending } = useDeleteMeetingEvents();
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
    return rawData?.data
      ? rawData.data.map((item: MeetingEventsType) => ({
          ...item,
          id: item.uuid,
        }))
      : [];
  }, [rawData]);

  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: 'photo',
      headerName: 'Image',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <InlineImageUpload
          imageUrl={params.row.photo?.[0]?.url}
          alt={params.row.name}
          loading={isUpdatingImage && imageVariables?.uuid === params.row.uuid}
          disabled={!checkPermission('meeting_room', 'Update')}
          onUpload={(file) => updateImage({ entity: 'meeting-event', uuid: params.row.uuid, file })}
        />
      ),
    },
    {
      field: 'name',
      headerName: 'Name',
      hideable: false,
      flex: 2,
    },
    {
      field: 'code',
      headerName: 'Code',
      flex: 1,
      valueGetter: (_, v) => v.code || '-',
    },
    {
      field: 'packages',
      headerName: 'Packages',
      flex: 2,
      valueGetter: (_, v) => v.packages?.map((item) => item.name).join(', ') || '-',
    },
    {
      field: 'layouts',
      headerName: 'Layouts',
      flex: 2,
      valueGetter: (_, v) => v.layouts?.map((layout) => layout.name).join(', ') || '-',
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      valueGetter: (_, v) => v.description || '-',
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
          disabled={!checkPermission('meeting_room', 'Update')}
          label={`Published status for ${params.row.name}`}
          onChange={(value) => toggleStatus({ entity: 'meeting-event', item: params.row, value })}
        />
      ),
    },
    ...generateCreatedUpdatedColumn(),
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
              href={`/dashboard/meeting-event/${params.row.uuid}`}
              className="flex items-center gap-2"
              disabled={!checkPermission('meeting_room', 'Update')}
            >
              <ListItemIcon>
                <Pencil size={'1rem'} />
              </ListItemIcon>
              Edit
            </MenuItem>
            {environment !== 'prod' && (
              <React.Fragment>
                <Divider key="meeting-event-divider" className="-mx-4 my-1" />
                <MenuItem
                  key="meeting-event-delete"
                  className="flex items-center gap-2 text-red-500"
                  onClick={() => setUuid(params.row.uuid)}
                  disabled={!checkPermission('meeting_room', 'Delete')}
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
              onSearch: (val: string) => setSearch(val),
              meetingPackage,
              onMeetingPackageChange: setMeetingPackage,
              meetingLayout,
              onMeetingLayoutChange: setMeetingLayout,
            } as MeetingEventsTableToolbarProps,
          }}
          slots={{
            toolbar: MeetingEventsTableToolbar as any,
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
            { uuid, version: data.find((item: MeetingEventsType) => item.uuid === uuid)?.version },
            {
              onSuccess() {
                setUuid('');
              },
            },
          )
        }
        loading={isPending}
        title="Delete Meeting Room"
        content="Are you sure you want to delete this meeting room? This action cannot be undone."
      />
    </>
  );
};

export default MeetingEventsTable;
