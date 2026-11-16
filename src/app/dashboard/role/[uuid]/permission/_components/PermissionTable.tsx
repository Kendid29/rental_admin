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

const PermissionTable = ({ uuid }: Props) => {
  const { data: rawData, isLoading } = useGetPermissions();

  const data = useMemo(() => {
    return rawData
      ? rawData.map((item, i) => ({
          ...item,
          id: item.uuid,
        }))
      : [];
  }, [rawData]);

  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: 'module_name',
      headerName: 'Permission',
      flex: 1,
    },
    {
      field: 'access',
      headerName: 'Access',
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
        // rows={[]}
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
        // rowHeight={92}
        paginationMode="client"
        showToolbar
      />
    </div>
  );
};

export default memo(PermissionTable);
