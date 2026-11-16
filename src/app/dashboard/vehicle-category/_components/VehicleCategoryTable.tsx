'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';

import { Chip, Divider, IconButton, ListItemIcon, MenuItem } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { Bike, Car, EllipsisVertical, Package, Pencil, Trash2 } from 'lucide-react';

import DataGrid from '@/components/mui/DataGrid';
import Menu from '@/components/mui/Menu';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import useTablePagination from '@/lib/hooks/useTablePagination';
import { usePermission } from '@/services/permission/usePermission';
import useDeleteVehicleCategory from '@/services/vehicle-category/useDeleteVehicleCategory';
import useGetVehicleCategories from '@/services/vehicle-category/useGetVehicleCategories';

import VehicleCategoryTableToolbar, {
  VehicleCategoryTableToolbarProps,
} from './VehicleCategoryTableToolbar';

const typeConfig: Record<
  string,
  { label: string; color: 'primary' | 'secondary' | 'default'; icon: React.ReactNode }
> = {
  mobil: {
    label: 'Mobil',
    color: 'primary',
    icon: <Car size="0.9rem" className="mr-1" />,
  },
  motor: {
    label: 'Motor',
    color: 'secondary',
    icon: <Bike size="0.9rem" className="mr-1" />,
  },
  barang: {
    label: 'Barang',
    color: 'default',
    icon: <Package size="0.9rem" className="mr-1" />,
  },
};

const VehicleCategoryTable = () => {
  const checkPermission = usePermission();
  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [deleteUuid, setDeleteUuid] = useState('');
  const [type, setType] = useState<string>('');

  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteVehicleCategory();

  const {
    data: rawData,
    isLoading,
    refetch,
  } = useGetVehicleCategories({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
      type,
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
      headerName: 'Nama Kategori',
      hideable: false,
      flex: 1.5,
      renderCell({ row }) {
        return (
          <div className="flex flex-col justify-center py-1">
            <span className="font-semibold text-slate-800">{row.name}</span>
            {row.code && <span className="font-mono text-xs text-slate-400">{row.code}</span>}
          </div>
        );
      },
    },
    {
      field: 'type',
      headerName: 'Tipe Utama',
      width: 130,
      renderCell({ row }) {
        const config = typeConfig[row.type] || {
          label: row.type,
          color: 'default',
          icon: null,
        };

        return (
          <Chip
            size="small"
            label={
              <span className="flex items-center">
                {config.icon}
                {config.label}
              </span>
            }
            color={config.color}
            variant="outlined"
            className="text-xs font-medium"
          />
        );
      },
    },
    {
      field: 'description',
      headerName: 'Deskripsi',
      flex: 2,
      valueGetter: (_, row) => row.description || '-',
    },
    {
      field: 'unit_count',
      headerName: 'Jumlah Unit',
      width: 140,
      renderCell({ row }) {
        return (
          <Chip
            size="small"
            variant="filled"
            label={`${row.unit_count || 0} Unit Terhubung`}
            className="text-xs font-medium"
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
        return (
          <Menu
            Button={IconButton}
            buttonProps={{
              children: <EllipsisVertical size={'1rem'} />,
            }}
          >
            <MenuItem
              component={Link}
              href={`/dashboard/vehicle-category/${params.value}`}
              disabled={!checkPermission('vehicle_category', 'Update')}
            >
              <ListItemIcon>
                <Pencil size={'1rem'} />
              </ListItemIcon>
              Edit
            </MenuItem>

            <Divider key="delete-divider" className="-mx-4 my-1" />
            <MenuItem
              key="delete-category"
              className="text-red-500"
              onClick={() => setDeleteUuid(params.value)}
              disabled={!checkPermission('vehicle_category', 'Delete')}
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
    <div className="flex h-1 flex-grow flex-col pb-16">
      <DataGrid
        rows={data}
        columns={columns}
        loading={isLoading}
        checkboxSelection={false}
        slotProps={{
          toolbar: {
            onSearch: (val) => setSearch(val),
            type,
            onTypeChange: setType,
          } as VehicleCategoryTableToolbarProps,
        }}
        slots={{
          toolbar: VehicleCategoryTableToolbar as any,
        }}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        paginationResponse={rawData?.pagination}
        paginationMode="server"
        showToolbar
      />
      <DeleteConfirmationModal
        open={!!deleteUuid}
        onClose={() => setDeleteUuid('')}
        onConfirm={() =>
          deleteCategory(
            { uuid: deleteUuid },
            {
              onSuccess() {
                setDeleteUuid('');
                refetch();
              },
            },
          )
        }
        loading={isDeleting}
        title="Hapus Kategori Kendaraan"
        content="Apakah Anda yakin ingin menghapus kategori ini? Semua unit yang terhubung perlu dipindahkan ke kategori lain."
      />
    </div>
  );
};

export default VehicleCategoryTable;
