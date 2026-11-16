import { memo, useMemo } from 'react';

import InputAdornment from '@mui/material/InputAdornment';
import { GridToolbarProps, Toolbar } from '@mui/x-data-grid';

import { Search } from 'lucide-react';

import AutoComplete from '@/components/ui/form/AutoComplete';
import TextInput from '@/components/ui/form/TextInput';
import useGetRoles from '@/services/role/useGetRoles';

export interface StaffTableToolbarProps extends GridToolbarProps {
  onSearch: (searchText: string) => void;
  role: string;
  onRoleChange: (role: string) => void;
}

const StaffTableToolbar = ({ onSearch, onRoleChange, role }: StaffTableToolbarProps) => {
  const { data: roles, isLoading: isLoadingRoles } = useGetRoles();

  return (
    <Toolbar className="flex min-h-auto flex-nowrap gap-3 border-b-0 p-3">
      <div className="flex gap-3">
        <AutoComplete
          name="role"
          options={roles?.data?.map((_role) => ({ label: _role.name, value: _role.uuid })) || []}
          onChange={(_, value) => onRoleChange(value as string)}
          value={role}
          className="w-52"
          renderInputProps={{ label: 'Role' }}
          loading={isLoadingRoles}
        />
      </div>

      <TextInput
        size="small"
        name="search"
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search..."
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

export default memo(StaffTableToolbar);
