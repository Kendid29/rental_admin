'use client';

import { useMemo, useState } from 'react';

import { Chip, IconButton, Tooltip, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { Eye, ShieldAlert } from 'lucide-react';

import DataGrid from '@/components/mui/DataGrid';
import { PaginationModelType } from '@/lib/hooks/useTablePagination';
import { ActivityLogItem } from '@/lib/types/activity-log.type';
import useGetActivityLogs from '@/services/update/useGetActivityLogs';

import { getActionColor, getMethodBadgeClass } from '../_utils';
import ActivityLogDetailModal from './ActivityLogDetailModal';
import ActivityLogTableToolbar, { ActivityLogTableToolbarProps } from './ActivityLogTableToolbar';

export interface ActivityLogTableProps {
  paginationModel: PaginationModelType;
  setPaginationModel: (paginationModel: PaginationModelType) => void;
  search: string;
  setSearch: (search: string) => void;
  action: string;
  setAction: (action: string) => void;
  dateRange: string;
  setDateRange: (dateRange: string) => void;
}

const ActivityLogTable = ({
  paginationModel,
  setPaginationModel,
  search,
  setSearch,
  action,
  setAction,
  dateRange,
  setDateRange,
}: ActivityLogTableProps) => {
  const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { data: rawData, isLoading } = useGetActivityLogs({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
      action: action || undefined,
      created_at_date_range: dateRange || undefined,
    },
  });

  const rawList: ActivityLogItem[] = useMemo(() => {
    if (!rawData?.data) return [];
    if (Array.isArray(rawData.data)) return rawData.data;
    return [];
  }, [rawData]);

  // Client-side fallback filter if backend returns array without applying query params
  const filteredData = useMemo(() => {
    return rawList.filter((item) => {
      if (action && item.action.toLowerCase() !== action.toLowerCase()) {
        return false;
      }

      if (search) {
        const query = search.toLowerCase();
        const descMatch = item.description?.toLowerCase().includes(query);
        const moduleMatch = item.module?.toLowerCase().includes(query);
        const actorNameMatch = item.actor?.name?.toLowerCase().includes(query);
        const actorEmailMatch = item.actor?.email?.toLowerCase().includes(query);
        const resourceMatch = item.resource?.label?.toLowerCase().includes(query);
        const ipMatch = item.request?.ip_address?.toLowerCase().includes(query);

        if (
          !descMatch &&
          !moduleMatch &&
          !actorNameMatch &&
          !actorEmailMatch &&
          !resourceMatch &&
          !ipMatch
        ) {
          return false;
        }
      }

      return true;
    });
  }, [rawList, action, search]);

  const rows = useMemo(() => {
    return filteredData.map((item, index) => ({
      ...item,
      id: item.uuid || `log-${index}`,
    }));
  }, [filteredData]);

  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: 'created_at',
      headerName: 'Waktu / Tanggal',
      width: 170,
      renderCell: (params) => (
        <span className="font-mono text-xs text-stone-700">{params.row.created_at}</span>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 120,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.row.action.toUpperCase()}
          color={getActionColor(params.row.action)}
          className="text-[11px] font-semibold uppercase"
        />
      ),
    },
    {
      field: 'module',
      headerName: 'Modul',
      width: 160,
      renderCell: (params) => (
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-700">
          {params.row.module}
        </span>
      ),
    },
    {
      field: 'description',
      headerName: 'Deskripsi',
      flex: 2,
      minWidth: 240,
      renderCell: (params) => (
        <Tooltip title={params.row.description} placement="top-start">
          <Typography variant="body2" className="truncate text-xs font-medium text-stone-800">
            {params.row.description}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'actor',
      headerName: 'Pelaku (Actor)',
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <div className="flex flex-col justify-center leading-tight">
          <span className="text-xs font-semibold text-stone-800">
            {params.row.actor?.name || 'Unknown'}
          </span>
          <span className="truncate text-[11px] text-stone-500">
            {params.row.actor?.email || '-'}
          </span>
        </div>
      ),
    },
    {
      field: 'request',
      headerName: 'Method & IP',
      width: 170,
      renderCell(params) {
        const req = params.row.request;

        if (!req) return <span className="text-xs text-stone-400">-</span>;
        return (
          <div className="flex items-center gap-1.5">
            <span
              className={`rounded border px-1.5 py-0.5 text-[10px] font-bold ${getMethodBadgeClass(
                req.method,
              )}`}
            >
              {req.method}
            </span>
            <span className="truncate font-mono text-xs text-stone-600">{req.ip_address}</span>
          </div>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Detail',
      width: 80,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Tooltip title="Lihat Detail Log">
          <IconButton
            size="small"
            color="primary"
            onClick={() => {
              setSelectedLog(params.row);
              setIsDetailOpen(true);
            }}
          >
            <Eye size="1.1rem" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <div className="flex h-1 flex-grow flex-col pb-16">
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          checkboxSelection={false}
          onRowClick={(params) => {
            setSelectedLog(params.row);
            setIsDetailOpen(true);
          }}
          className="cursor-pointer"
          slotProps={{
            toolbar: {
              onSearch: (val) => setSearch(val),
              action,
              onActionChange: (val) => setAction(val),
              dateRange,
              onDateRangeChange: (val) => setDateRange(val),
            } as ActivityLogTableToolbarProps,
          }}
          slots={{
            toolbar: ActivityLogTableToolbar as any,
          }}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationResponse={
            rawData?.pagination || {
              total_data: rows.length,
              data_per_page: paginationModel.pageSize,
              next_page: 0,
              prev_page: 0,
              first_page: 1,
              last_page: 1,
              next_page_url: '',
              previous_page_url: '',
              first_page_url: '',
              last_page_url: '',
              total_page: Math.ceil(rows.length / paginationModel.pageSize) || 1,
            }
          }
          paginationMode={rawData?.pagination ? 'server' : 'client'}
          showToolbar
        />
      </div>

      <ActivityLogDetailModal
        open={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedLog(null);
        }}
        logItem={selectedLog}
      />
    </>
  );
};

export default ActivityLogTable;
