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
import { environment } from '@/constant';
import useTablePagination from '@/lib/hooks/useTablePagination';
import { usePermission } from '@/services/permission/usePermission';
import useDeleteRoomType from '@/services/room-type/useDeleteRoomType';
import useGetRoomTypes from '@/services/room-type/useGetRoomTypes';
import useQuickUpdateFeatureImage from '@/services/useQuickUpdateFeatureImage';

import RoomTypeTableToolbar, { RoomTypeTableToolbarProps } from './RoomTypeTableToolbar';

const formatRoomTypeLabel = (isVirtualVilla: boolean, value?: string) => {
  if (isVirtualVilla || !value) return '-';

  return value.charAt(0).toUpperCase() + value.slice(1);
};

const RoomTypeTable = () => {
  const checkPermission = usePermission();

  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [uuid, setUuid] = useState('');
  const [bedType, setBedType] = useState('');
  const [bathType, setBathType] = useState('');

  const { data: rawData, isLoading } = useGetRoomTypes({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
      bed_type: bedType,
      bath_type: bathType,
    },
  });

  const { mutate, isPending } = useDeleteRoomType();
  const {
    mutate: updateImage,
    isPending: isUpdatingImage,
    variables: imageVariables,
  } = useQuickUpdateFeatureImage();

  const data = useMemo(() => {
    if (!rawData) return [];

    const villasMap = new Map<string, any>();

    rawData.data.forEach((item) => {
      if (item.villa) {
        if (!villasMap.has(item.villa.uuid)) {
          villasMap.set(item.villa.uuid, {
            id: `villa-${item.villa.uuid}`,
            uuid: `villa-${item.villa.uuid}`,
            name: `${item.villa.name}`,
            is_virtual_villa: true,
          });
        }
      }
    });

    const result: any[] = [];

    villasMap.forEach((villa) => {
      result.push(villa);
      const children = rawData.data.filter(
        (item) => item.villa?.uuid === villa.uuid.replace('villa-', ''),
      );

      children.forEach((child) => {
        result.push({
          ...child,
          id: child.uuid,
          is_virtual_villa: false,
          parent_uuid: villa.uuid,
        });
      });
    });

    const orphans = rawData.data.filter((item) => !item.villa);

    orphans.forEach((child) => {
      result.push({
        ...child,
        id: child.uuid,
        is_virtual_villa: false,
        parent_uuid: null,
      });
    });

    return result;
  }, [rawData]);

  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: 'room_type_images',
      headerName: 'Image',
      width: 120,
      sortable: false,
      renderCell: (params) =>
        params.row.is_virtual_villa ? null : (
          <InlineImageUpload
            imageUrl={params.row.room_type_images?.[0]?.url}
            alt={params.row.name}
            loading={isUpdatingImage && imageVariables?.uuid === params.row.uuid}
            disabled={!checkPermission('room_type', 'Update')}
            onUpload={(file) => updateImage({ entity: 'room-type', uuid: params.row.uuid, file })}
          />
        ),
    },
    {
      field: 'name',
      headerName: 'Villa / Type Name',
      hideable: false,
      flex: 2,
      renderCell(params) {
        const row = params.row;

        if (row.is_virtual_villa) {
          return <strong>{row.name}</strong>;
        }
        if (row.parent_uuid) {
          return <span className="ml-6 text-gray-500">↳ {row.name || '-'}</span>;
        }
        return <span>{row.name || '-'}</span>;
      },
    },
    {
      field: 'code',
      headerName: 'Code',
      flex: 1,
      valueGetter: (_, row) => (row.is_virtual_villa ? '-' : row.code || '-'),
    },
    {
      field: 'bed_type',
      headerName: 'Bed Type',
      flex: 1,
      valueGetter: (_, row) => formatRoomTypeLabel(row.is_virtual_villa, row.bed_type),
    },
    {
      field: 'bath_type',
      headerName: 'Bath Type',
      flex: 1,
      valueGetter: (_, row) => formatRoomTypeLabel(row.is_virtual_villa, row.bath_type),
    },
    {
      field: 'bed_count',
      headerName: 'Bed Count',
      flex: 1,
      type: 'number',
      valueGetter: (_, row) => (row.is_virtual_villa ? null : row.total_bed || null),
    },
    {
      field: 'max_occupancy',
      headerName: 'Max Occupancy',
      flex: 1,
      type: 'number',
      valueGetter: (_, row) => (row.is_virtual_villa ? null : row.occupancy || null),
    },
    {
      field: 'room_size',
      headerName: 'Room Size',
      flex: 1,
      valueGetter: (_, row) => (row.is_virtual_villa ? '-' : row.room_size || '-'),
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 3,
      valueGetter: (_, row) => (row.is_virtual_villa ? '-' : row.description || '-'),
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
        if (params.row.is_virtual_villa) return null;
        return (
          <Menu
            Button={IconButton}
            buttonProps={{
              children: <EllipsisVertical size={'1rem'} />,
            }}
          >
            <MenuItem
              component={Link}
              href={`/dashboard/room-type/${params.value}`}
              disabled={!checkPermission('room_type', 'Update')}
            >
              <ListItemIcon>
                <Pencil size={'1rem'} />
              </ListItemIcon>
              Edit
            </MenuItem>
            {environment !== 'prod' && (
              <React.Fragment>
                <Divider key="room-type-divider" className="-mx-4 my-1" />
                <MenuItem
                  key="room-type-delete"
                  className="text-red-500"
                  onClick={() => setUuid(params.value)}
                  disabled={!checkPermission('room_type', 'Delete')}
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
              bedType,
              onBedTypeChange: setBedType,
              bathType,
              onBathTypeChange: setBathType,
            } as RoomTypeTableToolbarProps,
          }}
          slots={{
            toolbar: RoomTypeTableToolbar as any,
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
        title="Delete Room Type"
        content="Are you sure you want to delete this room type? This action cannot be undone."
      />
    </>
  );
};

export default RoomTypeTable;
