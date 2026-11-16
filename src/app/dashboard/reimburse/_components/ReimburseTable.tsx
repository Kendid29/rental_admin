'use client';

import React, { useMemo, useState } from 'react';

import { Chip, IconButton, ListItemIcon, MenuItem, Tooltip } from '@mui/material';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';

import dayjs from 'dayjs';
import { CreditCard, EllipsisVertical, ExternalLink, Eye, Image as ImageIcon } from 'lucide-react';

import DataGrid from '@/components/mui/DataGrid';
import Menu from '@/components/mui/Menu';
import { ReimburseType } from '@/lib/types/reimburse.type';
import formatToRp from '@/lib/utils/formatToRp';
import { usePermission } from '@/services/permission/usePermission';
import useGetReimburses from '@/services/reimburse/useGetReimburses';

import PayReimburseModal from './PayReimburseModal';
import ReimburseDetailModal from './ReimburseDetailModal';
import ReimburseTableToolbar, { ReimburseTableToolbarProps } from './ReimburseTableToolbar';

const ReimburseTable = () => {
  const checkPermission = usePermission();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const [selectedDetail, setSelectedDetail] = useState<ReimburseType | null>(null);
  const [selectedPay, setSelectedPay] = useState<ReimburseType | null>(null);

  const {
    data: rawData,
    isLoading,
    refetch,
  } = useGetReimburses({
    params: {
      page: `${paginationModel.page + 1}`,
      page_size: `${paginationModel.pageSize}`,
      search,
      status,
    },
  });

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
      field: 'booking_number',
      headerName: 'Kode Transaksi',
      flex: 1.1,
      minWidth: 150,
      renderCell({ row }) {
        return (
          <div className="flex flex-col justify-center py-1">
            <span
              className="text-primary-600 cursor-pointer font-semibold hover:underline"
              onClick={() => setSelectedDetail(row)}
            >
              {row.booking_number}
            </span>
            <span className="text-[11px] text-slate-400">
              {row.created_at ? dayjs(row.created_at).format('DD/MM/YYYY HH:mm') : '-'}
            </span>
          </div>
        );
      },
    },
    {
      field: 'mitra',
      headerName: 'Mitra Penerima',
      flex: 1.3,
      minWidth: 180,
      renderCell({ row }) {
        return (
          <div className="flex flex-col justify-center py-1">
            <span className="font-medium text-slate-800">{row.mitra.name}</span>
            <span className="text-xs text-slate-500">
              {row.mitra.bank_name
                ? `${row.mitra.bank_name} - ${row.mitra.bank_account_number}`
                : '-'}
            </span>
          </div>
        );
      },
    },
    {
      field: 'unit',
      headerName: 'Unit Rental',
      flex: 1.3,
      minWidth: 170,
      renderCell({ row }) {
        return (
          <div className="flex flex-col justify-center py-1">
            <span className="font-medium text-slate-800">{row.unit?.name || '-'}</span>
            <span className="text-xs text-slate-500">
              {row.unit?.plate_number || row.unit?.category || '-'}
            </span>
          </div>
        );
      },
    },
    {
      field: 'total_transaction',
      headerName: 'Total Transaksi',
      flex: 1,
      minWidth: 130,
      renderCell({ row }) {
        return (
          <div className="flex items-center text-slate-700">
            {formatToRp(row.total_transaction)}
          </div>
        );
      },
    },
    {
      field: 'nominal_reimburse',
      headerName: 'Nominal Reimburse',
      flex: 1.1,
      minWidth: 140,
      renderCell({ row }) {
        return (
          <div className="text-primary-600 flex items-center font-bold">
            {formatToRp(row.nominal_reimburse)}
          </div>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 130,
      renderCell({ row }) {
        const isPaid = row.status === 'sudah_dibayar';

        return (
          <Chip
            size="small"
            label={isPaid ? 'Sudah Dibayar' : 'Belum Dibayar'}
            color={isPaid ? 'success' : 'warning'}
            variant="outlined"
            className="font-medium capitalize"
          />
        );
      },
    },
    {
      field: 'payment_date',
      headerName: 'Tanggal Bayar',
      flex: 1,
      minWidth: 130,
      renderCell({ row }) {
        return (
          <div className="flex items-center text-xs text-slate-600">
            {row.payment_date ? dayjs(row.payment_date).format('DD/MM/YYYY') : '-'}
          </div>
        );
      },
    },
    {
      field: 'transfer_proof_url',
      headerName: 'Bukti Transfer',
      flex: 0.9,
      minWidth: 110,
      sortable: false,
      renderCell({ row }) {
        if (!row.transfer_proof_url) {
          return <span className="text-xs text-slate-400">-</span>;
        }

        return (
          <Tooltip title="Buka bukti transfer">
            <a
              href={row.transfer_proof_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
            >
              <ImageIcon size={13} className="text-primary-600" />
              <span>Bukti</span>
              <ExternalLink size={11} className="text-slate-400" />
            </a>
          </Tooltip>
        );
      },
    },
    {
      field: 'uuid',
      headerName: 'Aksi',
      width: 60,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      type: 'actions',
      renderCell({ row }) {
        const canUpdate = checkPermission('reimburse', 'Update');
        const isPaid = row.status === 'sudah_dibayar';

        return (
          <Menu
            Button={IconButton}
            buttonProps={{
              children: <EllipsisVertical size={'1rem'} />,
            }}
          >
            <MenuItem onClick={() => setSelectedDetail(row)}>
              <ListItemIcon>
                <Eye size={'1rem'} />
              </ListItemIcon>
              Lihat Detail
            </MenuItem>

            {!isPaid && canUpdate && (
              <MenuItem onClick={() => setSelectedPay(row)}>
                <ListItemIcon>
                  <CreditCard size={'1rem'} className="text-emerald-600" />
                </ListItemIcon>
                Tandai Sudah Dibayar
              </MenuItem>
            )}
          </Menu>
        );
      },
    },
  ];

  return (
    <>
      <DataGrid
        rows={data}
        columns={columns}
        loading={isLoading}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        paginationResponse={rawData?.pagination}
        paginationMode="server"
        slots={{
          toolbar: ReimburseTableToolbar as any,
        }}
        slotProps={{
          toolbar: {
            onSearch: (val: string) => setSearch(val),
            status,
            onStatusChange: setStatus,
          } as ReimburseTableToolbarProps,
        }}
        showToolbar
        disableRowSelectionOnClick
        autoHeight
      />

      <ReimburseDetailModal
        open={!!selectedDetail}
        onClose={() => setSelectedDetail(null)}
        reimburse={selectedDetail}
        onPayClick={(item) => setSelectedPay(item)}
      />

      <PayReimburseModal
        open={!!selectedPay}
        onClose={() => setSelectedPay(null)}
        reimburse={selectedPay}
        onSuccess={() => refetch()}
      />
    </>
  );
};

export default ReimburseTable;
