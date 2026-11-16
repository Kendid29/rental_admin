import { memo, useMemo, useState } from 'react';

import { GridColDef } from '@mui/x-data-grid';

import { useDebounce } from '@uidotdev/usehooks';

import DataGrid from '@/components/mui/DataGrid';
import fastTokenFuzzySearch from '@/lib/utils/tokenFuzzySearch';
import useGetPermissions from '@/services/permission/useGetPermissions';

import PermissionCheckbox from './PermissionCheckbox';
import PermissionTableToolbar, { PermissionTableToolbarProps } from './PermissionTableToolbar';

interface Props {
  uuid: string;
}

const MODULE_LABELS: Record<string, string> = {
  admin: 'Admin',
  user: 'User / Pelanggan',
  permission: 'Permission & Role',
  mitra: 'Master Mitra',
  vehicle_category: 'Kategori Kendaraan',
  master: 'Master Data',
  rules: 'Aturan Sewa (Rules)',
  transaksi: 'Transaksi Sewa',
  reimburse: 'Reimburse Mitra',
  update: 'Update / Log Aktivitas',
  suspend: 'Suspend',
};

const PermissionTable = ({ uuid }: Props) => {
  const { data: rawData, isLoading } = useGetPermissions();

  const data = useMemo(() => {
    return rawData
      ? rawData.map((item) => ({
          ...item,
          id: item.uuid,
        }))
      : [];
  }, [rawData]);

  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: 'module_name',
      headerName: 'Modul Sistem',
      flex: 1.2,
      valueGetter: (_, row) => MODULE_LABELS[row.module_name.toLowerCase()] || row.module_name,
    },
    {
      field: 'access',
      headerName: 'Matriks Hak Akses (CRUD)',
      flex: 3,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell({ row }) {
        return <PermissionCheckbox role_uuid={uuid} data={data} module_name={row.module_name} />;
      },
    },
  ];

  const [searchText, setSearchText] = useState('');
  const debounceSearch = useDebounce(searchText, 300);

  const filteredRows = useMemo(() => {
    const filtered = data.filter(
      (item, index, self) => self.findIndex((t) => t.module_name === item.module_name) === index,
    );

    return fastTokenFuzzySearch(filtered, debounceSearch, 'module_name');
  }, [debounceSearch, data]);

  return (
    <div className="flex h-1 flex-grow flex-col pb-16">
      <DataGrid
        rows={filteredRows}
        columns={columns}
        loading={isLoading}
        checkboxSelection={false}
        slotProps={{
          toolbar: {
            onSearch: (val) => setSearchText(val),
          } as PermissionTableToolbarProps,
        }}
        slots={{
          toolbar: PermissionTableToolbar as any,
        }}
        paginationMode="client"
        showToolbar
      />
    </div>
  );
};

export default memo(PermissionTable);
