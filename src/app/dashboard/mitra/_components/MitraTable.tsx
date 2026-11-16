'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';

import { Chip, Divider, IconButton, ListItemIcon, MenuItem } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { parsePhoneNumber } from 'libphonenumber-js/min';
import { Building2, EllipsisVertical, Eye, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

import DataGrid from '@/components/mui/DataGrid';
import Menu from '@/components/mui/Menu';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import useTablePagination from '@/lib/hooks/useTablePagination';
import useDeleteMitra from '@/services/mitra/useDeleteMitra';
import useGetMitras from '@/services/mitra/useGetMitras';
import { usePermission } from '@/services/permission/usePermission';

import MitraTableToolbar, { MitraTableToolbarProps } from './MitraTableToolbar';

const statusMap: Record<string, { label: string; color: 'success' | 'warning' | 'default' }> = {
  aktif: { label: 'Aktif', color: 'success' },
  ditangguhkan: { label: 'Ditangguhkan', color: 'warning' },
  tidak_aktif: { label: 'Tidak Aktif', color: 'default' },
};

const MitraTable = () => {
  const checkPermission = usePermission();
  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [deleteUuid, setDeleteUuid] = useState('');
  const [status, setStatus] = useState<string>('');

  const { mutate: deleteMitra, isPending: isDeleting } = useDeleteMitra();

  const {
    data: rawData,
    isLoading,
    refetch,
  } = useGetMitras({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
      status,
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
      headerName: 'Nama Mitra & Badan Usaha',
      hideable: false,
      flex: 1.8,
      renderCell({ row }) {
        return (
          <div className="flex flex-col justify-center py-1">
            <span className="font-semibold text-slate-800">{row.name}</span>
            {row.company && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Building2 size="0.75rem" /> {row.company}
              </span>
            )}
          </div>
        );
      },
    },
    {
      field: 'contact',
      headerName: 'Kontak',
      flex: 1.5,
      renderCell({ row }) {
        let formattedPhone = row.phone_number || '-';

        try {
          if (row.phone_number) {
            formattedPhone = parsePhoneNumber(row.phone_number, 'ID').formatInternational();
          }
        } catch {
          formattedPhone = row.phone_number || '-';
        }

        return (
          <div className="flex flex-col justify-center py-1 text-xs">
            <span className="font-medium text-slate-800">{formattedPhone}</span>
            <span className="text-slate-500">{row.email}</span>
          </div>
        );
      },
    },
    {
      field: 'city',
      headerName: 'Kota / Wilayah',
      flex: 1,
      renderCell({ row }) {
        return (
          <div className="flex flex-col justify-center py-1 text-xs">
            <span className="font-medium text-slate-800">{row.city || '-'}</span>
            <span className="max-w-40 truncate text-slate-500">{row.address || '-'}</span>
          </div>
        );
      },
    },
    {
      field: 'cooperation_status',
      headerName: 'Status Kerja Sama',
      width: 140,
      renderCell({ row }) {
        const val = row.cooperation_status || 'aktif';
        const config = statusMap[val] || { label: val, color: 'default' };

        return (
          <Chip
            size="small"
            label={config.label}
            color={config.color}
            variant="filled"
            className="text-xs font-medium"
          />
        );
      },
    },
    {
      field: 'bank_account',
      headerName: 'Rekening Bank',
      flex: 1.5,
      renderCell({ row }) {
        if (!row.bank_account_number) return <span className="text-xs text-slate-400">-</span>;

        return (
          <div className="flex flex-col justify-center py-1 text-xs">
            <span className="font-medium text-slate-800">
              {row.bank_name || 'Bank'} - {row.bank_account_number}
            </span>
            <span className="text-slate-500">a/n {row.bank_account_holder || row.name}</span>
          </div>
        );
      },
    },
    {
      field: 'units',
      headerName: 'Unit',
      width: 90,
      renderCell({ row }) {
        const count = row.units?.length || 0;

        return <Chip size="small" variant="outlined" label={`${count} unit`} className="text-xs" />;
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
              href={`/dashboard/mitra/${params.value}`}
              disabled={!checkPermission('mitra', 'Read')}
            >
              <ListItemIcon>
                <Eye size={'1rem'} />
              </ListItemIcon>
              Detail & Daftar Unit
            </MenuItem>

            <MenuItem
              component={Link}
              href={`/dashboard/mitra/${params.value}`}
              disabled={!checkPermission('mitra', 'Update')}
            >
              <ListItemIcon>
                <Pencil size={'1rem'} />
              </ListItemIcon>
              Edit Mitra
            </MenuItem>

            <Divider key="delete-divider" className="-mx-4 my-1" />
            <MenuItem
              key="delete-mitra"
              className="text-red-500"
              onClick={() => setDeleteUuid(params.value)}
              disabled={!checkPermission('mitra', 'Delete')}
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
            status,
            onStatusChange: setStatus,
          } as MitraTableToolbarProps,
        }}
        slots={{
          toolbar: MitraTableToolbar as any,
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
          deleteMitra(
            { uuid: deleteUuid, version: data.find((item) => item.uuid === deleteUuid)?.version },
            {
              onSuccess() {
                setDeleteUuid('');
                toast('Mitra berhasil dihapus', { type: 'success' });
                refetch();
              },
            },
          )
        }
        loading={isDeleting}
        title="Hapus Mitra"
        content="Apakah Anda yakin ingin menghapus data mitra ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
};

export default MitraTable;
