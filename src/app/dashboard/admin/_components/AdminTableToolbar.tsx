import { memo } from 'react';

import InputAdornment from '@mui/material/InputAdornment';
import { GridToolbarProps, Toolbar } from '@mui/x-data-grid';

import { Search } from 'lucide-react';

import AutoComplete from '@/components/ui/form/AutoComplete';
import TextInput from '@/components/ui/form/TextInput';
import useGetRoles from '@/services/permission/useGetRoles';

export interface AdminTableToolbarProps extends GridToolbarProps {
  onSearch: (searchText: string) => void;
  role: string;
  onRoleChange: (role: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
}

const statusOptions = [
  { label: 'Semua Status', value: '' },
  { label: 'Aktif', value: 'aktif' },
  { label: 'Tidak Aktif', value: 'tidak_aktif' },
];

const AdminTableToolbar = ({
  onSearch,
  onRoleChange,
  role,
  status,
  onStatusChange,
}: AdminTableToolbarProps) => {
  const { data: roles, isLoading: isLoadingRoles } = useGetRoles();

  const roleOptions = [
    { label: 'Semua Role', value: '' },
    ...(roles?.data
      ?.filter((r: any) => r.code !== 'member')
      ?.map((_role: any) => ({ label: _role.name, value: _role.uuid })) || []),
  ];

  return (
    <Toolbar className="flex min-h-auto flex-wrap gap-3 border-b-0 p-3 sm:flex-nowrap">
      <div className="flex gap-3">
        <AutoComplete
          name="role"
          options={roleOptions}
          onChange={(_, value) => onRoleChange(value as string)}
          value={role}
          className="w-48"
          renderInputProps={{ label: 'Role' }}
          loading={isLoadingRoles}
        />
        <AutoComplete
          name="status"
          options={statusOptions}
          onChange={(_, value) => onStatusChange(value as string)}
          value={status}
          className="w-40"
          renderInputProps={{ label: 'Status' }}
        />
      </div>

      <TextInput
        size="small"
        name="search"
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Cari nama, email, atau telepon admin..."
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search size={'1rem'} />
              </InputAdornment>
            ),
          },
        }}
      />
    </Toolbar>
  );
};

export default memo(AdminTableToolbar);
