'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';

import { Divider, IconButton, ListItemIcon, MenuItem } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';

import DataGrid from '@/components/mui/DataGrid';
import Menu from '@/components/mui/Menu';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import { environment } from '@/constant';
import useTablePagination from '@/lib/hooks/useTablePagination';
import formatToRp from '@/lib/utils/formatToRp';
import { usePermission } from '@/services/permission/usePermission';
import useDeleteRoomsAndPricing from '@/services/rooms-and-pricing/useDeleteRoomsAndPricing';
import useGetRoomsAndPricing from '@/services/rooms-and-pricing/useGetRoomsAndPricing';
import useGetRoomsAndPricings from '@/services/rooms-and-pricing/useGetRoomsAndPricings';

import { BED_TYPE } from '../../room-type/_utils';
import RoomsAndPricingTableToolbar, {
  RoomsAndPricingTableToolbarProps,
} from './RoomsAndPricingTableToolbar';

interface Props {
  date?: string;
}

const RoomsAndPricingTable = ({ date }: Props) => {
  const checkPermission = usePermission();

  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [uuid, setUuid] = useState('');
  const [roomType, setRoomType] = useState('');
  const [bedType, setBedType] = useState('');

  const { data: rawData, isLoading } = useGetRoomsAndPricings({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
      date: date || '',
      room_type_uuid: roomType,
      bed_type: bedType,
    },
    enabled: !!date,
  });

  const { mutate, isPending } = useDeleteRoomsAndPricing();

  const data = useMemo(() => {
    if (!rawData) return [];

    const mappedData = rawData.data.map((item) => {
      let parent_uuid = item.uuid;
      let is_parent = true;
      if (item.villa_selling_price === null || item.villa_selling_price === undefined) {
        is_parent = false;
        const parent = rawData.data.find(
          (p) =>
            p.villa_selling_price !== null &&
            p.villa_class?.uuid === item.villa_class?.uuid &&
            p.date === item.date,
        );
        if (parent) parent_uuid = parent.uuid;
      }

      return {
        ...item,
        id: item.uuid,
        parent_uuid,
        is_parent,
      };
    });

    const result: typeof mappedData = [];
    const parents = mappedData.filter((item) => item.is_parent);
    const children = mappedData.filter((item) => !item.is_parent);

    parents.forEach((parent) => {
      result.push(parent);
      const parentChildren = children.filter((child) => child.parent_uuid === parent.uuid);
      // Sort children alphabetically by room name
      parentChildren.sort((a, b) =>
        (a.room_type?.name || '').localeCompare(b.room_type?.name || ''),
      );
      result.push(...parentChildren);
    });

    // Append any orphans (children without a parent in the current page)
    const pushedIds = new Set(result.map((r) => r.id));
    const orphans = mappedData.filter((item) => !pushedIds.has(item.id));
    result.push(...orphans);

    return result;
  }, [rawData]);

  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: 'villa_class.name',
      headerName: 'Villa / Room',
      flex: 2,
      renderCell: (params) => {
        const row = params.row;
        if (row.villa_selling_price !== null && row.villa_selling_price !== undefined) {
          return <strong>{row.villa_class?.name || '-'} (Full Villa)</strong>;
        }
        return <span className="ml-6 text-gray-500">↳ {row.room_type?.name || '-'}</span>;
      },
    },
    {
      field: 'rooms',
      headerName: 'Rooms',
      flex: 1,
      valueGetter: (_, row) => {
        if (row.villa_selling_price !== null && row.villa_selling_price !== undefined) {
          return row.rooms?.length || row.room_quantity || '-';
        }
        return '-';
      },
    },
    {
      field: 'feature_highlight.bed_type',
      headerName: 'Bed Type',
      flex: 1,
      valueGetter: (_, row) => {
        if (row.villa_selling_price !== null && row.villa_selling_price !== undefined) {
          return '-';
        }
        return (
          BED_TYPE.find((item) => item.value === row.feature_highlight?.bed_type)?.label || '-'
        );
      },
    },
    {
      field: 'selling_price',
      headerName: 'Selling Price',
      flex: 1,
      type: 'number',
      valueGetter: (_, row) => formatToRp(row.villa_selling_price || row.selling_price),
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
        if (row.villa_selling_price === null || row.villa_selling_price === undefined) {
          return null;
        }

        return (
          <Menu
            Button={IconButton}
            buttonProps={{
              children: <EllipsisVertical size={'1rem'} />,
            }}
          >
            <MenuItem
              component={Link}
              href={`/dashboard/rooms-and-pricing/${params.row.parent_uuid}`}
              disabled={!checkPermission('room_pricing', 'Update')}
            >
              <ListItemIcon>
                <Pencil size={'1rem'} />
              </ListItemIcon>
              Edit
            </MenuItem>
            {/* {environment !== 'prod' && (
              <> */}
            <Divider className="-mx-4 my-1" />
            <MenuItem
              className="text-red-500"
              onClick={() => setUuid(params.value)}
              disabled={!checkPermission('room_pricing', 'Delete')}
            >
              <ListItemIcon>
                <Trash2 size={'1rem'} className="text-red-500" />
              </ListItemIcon>
              Delete
            </MenuItem>
            {/* </>
            )} */}
          </Menu>
        );
      },
    },
  ];

  return (
    <>
      <div className="mb-2 flex h-[75vh] flex-col">
        <DataGrid
          rows={data}
          columns={columns}
          checkboxSelection={false}
          slotProps={{
            toolbar: {
              onSearch: (val) => setSearch(val),
              roomType,
              onRoomTypeChange: setRoomType,
              bedType,
              onBedTypeChange: setBedType,
            } as RoomsAndPricingTableToolbarProps,
          }}
          slots={{
            toolbar: RoomsAndPricingTableToolbar as any,
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
        title="Delete Room and Pricing"
        content="Are you sure you want to delete this room and pricing? This action cannot be undone."
      />
    </>
  );
};

export default RoomsAndPricingTable;
